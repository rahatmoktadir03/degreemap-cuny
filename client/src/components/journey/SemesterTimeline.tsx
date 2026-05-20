import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Circle } from "lucide-react";
import type { Roadmap, Semester } from "../../types/roadmap";
import { Semester as SemesterConst } from "../../types/roadmap";

interface SemesterTimelineProps {
  roadmap: Roadmap;
}

export const SemesterTimeline: React.FC<SemesterTimelineProps> = ({ roadmap }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Group nodes by semester
  const coursesBySemester: Record<string, typeof roadmap.nodes> = {};

  roadmap.nodes.forEach((node) => {
    if ((node.type === "course" || node.type === "elective") && node.data) {
      const data = node.data as any;
      const semester = data.semester || "Unknown";
      if (!coursesBySemester[semester]) {
        coursesBySemester[semester] = [];
      }
      coursesBySemester[semester].push(node);
    }
  });

  // Order semesters
  const semesterOrder = [SemesterConst.Fall, SemesterConst.Spring, SemesterConst.Summer];
  const semesters = Object.keys(coursesBySemester).sort(
    (a, b) => semesterOrder.indexOf(a as Semester) - semesterOrder.indexOf(b as Semester)
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700";
      case "in-progress":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700";
      default:
        return "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Circle className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return "Done";
      case "in-progress":
        return "In Progress";
      default:
        return "Planned";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Semester Timeline</h3>

      {semesters.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No courses in this roadmap
        </p>
      ) : (
        <div className="space-y-8">
          {semesters.map((semester) => (
            <div key={semester}>
              {/* Semester Header */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{semester}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {coursesBySemester[semester].length} course(s)
                </p>
              </div>

              {/* Carousel Container */}
              <div className="relative">
                {/* Embla Carousel */}
                <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                  <div className="flex gap-4">
                    {coursesBySemester[semester].map((node) => {
                      const data = node.data as any;
                      return (
                        <div key={node.id} className="flex-shrink-0 w-80">
                          <div
                            className={`p-4 rounded-lg border-2 h-full transition-all duration-200 hover:shadow-lg ${getStatusColor(
                              data.status
                            )}`}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="mt-1">{getStatusIcon(data.status)}</div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-sm line-clamp-2">{data.label}</h5>
                                <p className="text-xs opacity-75 mt-1">{data.credits} credits</p>
                              </div>
                            </div>

                            {data.notes && (
                              <p className="text-xs opacity-70 mb-3 line-clamp-2">{data.notes}</p>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t border-current/20">
                              <span className="text-xs font-medium opacity-75">
                                {getStatusBadge(data.status)}
                              </span>
                              <span className="text-xs opacity-50">
                                Code: {node.id.slice(0, 6)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={scrollPrev}
                  disabled={prevBtnDisabled}
                  className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={scrollNext}
                  disabled={nextBtnDisabled}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
