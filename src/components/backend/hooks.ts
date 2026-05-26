"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import type {AuthorDTO, CourseListDTO, CourseDetailDTO, SiteDetailDTO, StudentDTO} from "./types.ts";
import { ApiError, toApiError } from "@/lib/apiError";
import {
    fetchAuthorById,
    fetchCourseById,
    fetchCourses,
    fetchCoursesAdmin,
    fetchSiteDetails,
    fetchStudentById,
    fetchStudents
} from "@/components/backend/api";

// Hook for list of courses
export function useCourses() {
    const [data, setData] = useState<CourseListDTO[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchCourses(); // returns CourseListDTO[]
                if (!mounted) return;
                setData(res);
            } catch (e) {
                if (!mounted) return;
                setError(toApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return { items: data, loading, error };
}

type UseCoursesAdminResult = {
  items: CourseListDTO[] | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
};

export function useCoursesAdmin(): UseCoursesAdminResult {
  const [items, setItems] = useState<CourseListDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // guard against setState after unmount
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  // single load function
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCoursesAdmin();
      setItems(res);
    } catch (e) {
        setError(toApiError(e));
    } finally {
        if (mountedRef.current) setLoading(false);
    }
  }, []);

  // initial fetch on mount
  useEffect(() => {
    // invoke directly; don't depend on `load` to avoid weird re-runs
    (async () => { await load(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // public refetch
  const refetch = useCallback(async () => {
    await load();
  }, [load]);

  return { items, loading, error, refetch };
}


// Hook for single course detail
export function useCourse(id?: string) {
    const [data, setData] = useState<CourseDetailDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        if (!id) return;
        let mounted = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const dto = await fetchCourseById(id); // returns CourseDetailDTO
                if (!mounted) return;
                setData(dto);
            } catch (e) {
                if (!mounted) return;
                setError(toApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    return { data, loading, error };
}

export function useAuthor(id?: string) {
    const [data, setData] = useState<AuthorDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        if (!id) return;
        let mounted = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const dto = await fetchAuthorById(id);
                if (!mounted) return;
                setData(dto);
            } catch (e) {
                if (!mounted) return;
                setError(toApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    return { data, loading, error };
}

export function useStudents() {
    const [data, setData] = useState<StudentDTO[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchStudents();
                if (!mounted) return;
                setData(res);
            } catch (e) {
                if (!mounted) return;
                setError(toApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return { items: data, loading, error };
}

// Hook for single student detail
export function useStudent(id?: string) {
    const [data, setData] = useState<StudentDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        if (!id) return;
        let mounted = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const dto = await fetchStudentById(id); // returns StudentDTO
                if (!mounted) return;
                setData(dto);
            } catch (e) {
                if (!mounted) return;
                setError(toApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id]);

    return { data, loading, error };
}

export function useSiteDetails() {
    const [data, setData] = useState<SiteDetailDTO[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchSiteDetails();
                if (!mounted) return;
                setData(res);
            } catch (e) {
                if (!mounted) return;
                setError(toApiError(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return { items: data, loading, error };
}

