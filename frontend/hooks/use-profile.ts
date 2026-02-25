import {
  ApiError,
  fetchProfile,
  fetchProgress,
  ProfileResponse,
  ProfileSection,
  updateSection as updateSectionApi,
  uploadPhoto as uploadPhotoApi,
} from "@/lib/api-client";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import Toast from "react-native-toast-message";

function recalcCompletion(profile: ProfileResponse): ProfileResponse {
  const completed = profile.sections.filter(
    (s) => s.status === "complete",
  ).length;
  return {
    ...profile,
    completionPercentage: Math.round(
      (completed / profile.sections.length) * 100,
    ),
  };
}

function useAbortSignal() {
  const ref = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      ref.current?.abort();
    },
    [],
  );

  const next = useCallback(() => {
    ref.current?.abort();
    const ac = new AbortController();
    ref.current = ac;
    return ac.signal;
  }, []);

  const abort = useCallback(() => {
    ref.current?.abort();
    ref.current = null;
  }, []);

  return { next, abort };
}

function patchCachedSection(
  queryClient: QueryClient,
  sectionId: string,
  patch: Partial<ProfileSection>,
) {
  queryClient.setQueryData<ProfileResponse>(["profile"], (old) => {
    if (!old) return old;
    return recalcCompletion({
      ...old,
      sections: old.sections.map((s) =>
        s.id === sectionId ? { ...s, ...patch } : s,
      ),
    });
  });
}

export const useProfile = () => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: ({ signal }) => fetchProfile(signal),
  });

  return {
    profile: data ?? null,
    sections: data?.sections ?? [],
    completionPercentage: data?.completionPercentage ?? 0,
    loading: isLoading,
    fetching: isFetching,
    error,
    refetch,
  };
};

// Toggle: set to true to enable polling GET /api/profile/progress every 5s
const POLLING_ENABLED = true;
const POLLING_INTERVAL = 5_000;

export const useProgressPolling = () => {
  const queryClient = useQueryClient();

  useQuery({
    queryKey: ["progress"],
    queryFn: ({ signal }) => fetchProgress(signal),
    refetchInterval: POLLING_INTERVAL,
    enabled: POLLING_ENABLED,
    select: (data) => {
      queryClient.setQueryData<ProfileResponse>(["profile"], (old) => {
        if (!old) return old;
        if (old.completionPercentage === data.completionPercentage) return old;
        return { ...old, completionPercentage: data.completionPercentage };
      });
      return data;
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  const signal = useAbortSignal();

  const mutation = useMutation({
    mutationFn: async ({
      sectionId,
      status,
      data,
    }: {
      sectionId: string;
      status: string;
      data?: Record<string, unknown>;
    }) => {
      return updateSectionApi(sectionId, status, data, signal.next());
    },
    onMutate: async ({ sectionId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      const previous = queryClient.getQueryData<ProfileResponse>(["profile"]);
      patchCachedSection(queryClient, sectionId, {
        status: status as "todo" | "complete",
      });
      return { previous };
    },
    onSuccess: (data, { sectionId }) => {
      patchCachedSection(queryClient, sectionId, data);
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["profile"], context.previous);
      }
    },
  });

  const updateSection = useCallback(
    async (
      sectionId: string,
      status: string,
      data?: Record<string, unknown>,
    ) => {
      try {
        return await mutation.mutateAsync({ sectionId, status, data });
      } catch (err: any) {
        if (err.name === "AbortError") return null;
        if (err instanceof ApiError && err.statusCode === 409) {
          Toast.show({
            type: "error",
            text1:
              "Conflict: data was updated elsewhere. Try to save your data again",
          });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          return null;
        }
        throw err;
      }
    },
    [mutation, queryClient],
  );

  return { updateSection, loading: mutation.isPending, error: mutation.error };
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  const signal = useAbortSignal();

  const mutation = useMutation({
    mutationFn: async (photoUri: string) => {
      return uploadPhotoApi(photoUri, signal.next());
    },

    onSuccess: (data) => {
      patchCachedSection(queryClient, "photo", {
        photoUri: data.photoUri,
        status: "complete" as const,
      });
    },
  });

  const uploadPhoto = useCallback(
    async (photoUri: string) => {
      try {
        return await mutation.mutateAsync(photoUri);
      } catch (err: any) {
        if (err.name === "AbortError") return null;
        throw err;
      }
    },
    [mutation],
  );

  const cancelUpload = useCallback(() => {
    signal.abort();
  }, [signal]);

  return {
    uploadPhoto,
    cancelUpload,
    loading: mutation.isPending,
    error: mutation.error,
  };
};
