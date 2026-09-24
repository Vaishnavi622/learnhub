import { Link } from "react-router-dom";
import courses from "../data/courses";

function MyCourses() {

  const rawEnrolled =
    JSON.parse(
      localStorage.getItem("enrolledCourses")
    ) || [];

  const enrolledIds = rawEnrolled.map((item) =>
    typeof item === "object" && item !== null ? item.id : Number(item)
  );

  const myCourses = courses.filter(
    (course) =>
      enrolledIds.includes(course.id)
  );


  return (

    <div className="my-courses-page">


      <div className="my-courses-header">

        <h1>
          My Courses
        </h1>

        <p>
          Continue learning from where you stopped.
        </p>

      </div>


      {myCourses.length === 0 ? (

        <div className="no-enrolled-courses">

          <h2>
            No courses enrolled yet
          </h2>

          <p>
            Explore our free courses and start learning.
          </p>

          <Link to="/courses">

            <button className="primary-btn">
              Explore Courses
            </button>

          </Link>

        </div>

      ) : (


        <div className="my-courses-grid">

          {myCourses.map((course) => {


            const storageKey =
              `completedLessons_${course.id}`;


            const completedLessons =
              JSON.parse(
                localStorage.getItem(storageKey)
              ) || [];


            const totalLessons = 6;


            const progress = Math.round(

              (completedLessons.length /
                totalLessons) * 100

            );


            return (

              <div
                className="my-course-card"
                key={course.id}
              >


                <div className="my-course-image">

                  FREE

                </div>


                <div className="my-course-content">


                  <h2>
                    {course.title}
                  </h2>


                  <p>
                    {course.description}
                  </p>


                  {/* PROGRESS */}

                  <div className="progress-container">


                    <div className="progress-label">

                      <span>
                        Progress
                      </span>

                      <span>
                        {progress}%
                      </span>

                    </div>


                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`
                        }}
                      />

                    </div>


                  </div>


                  <Link
                    to={`/learn/${course.id}`}
                  >

                    <button className="continue-btn">

                      {progress === 100
                        ? "Course Completed"
                        : "Continue Learning"}

                    </button>

                  </Link>


                </div>


              </div>

            );

          })}

        </div>

      )}

    </div>

  );

}

export default MyCourses;