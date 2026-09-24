import { Link } from "react-router-dom";


function AdminDashboard() {

  return (

    <div className="admin-page">


      {/* =================================
          ADMIN HEADER
      ================================= */}

      <div className="admin-header">

        <div>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage courses, students and learning content.
          </p>

        </div>

      </div>



      {/* =================================
          STATISTICS
      ================================= */}

      <div className="admin-stats">


        {/* Total Courses */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📚
          </div>

          <div>

            <h2>
              8
            </h2>

            <p>
              Total Courses
            </p>

          </div>

        </div>



        {/* Total Students */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👨‍🎓
          </div>

          <div>

            <h2>
              150
            </h2>

            <p>
              Total Students
            </p>

          </div>

        </div>



        {/* Enrollments */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📝
          </div>

          <div>

            <h2>
              325
            </h2>

            <p>
              Total Enrollments
            </p>

          </div>

        </div>



        {/* Completed */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✅
          </div>

          <div>

            <h2>
              85
            </h2>

            <p>
              Completed Courses
            </p>

          </div>

        </div>


      </div>



      {/* =================================
          MANAGEMENT
      ================================= */}

      <div className="admin-section">

        <h2>
          Management
        </h2>


        <div className="admin-menu-grid">


          {/* Manage Courses */}

          <Link
            to="/admin/courses"
            className="admin-menu-card"
          >

            <div className="admin-menu-icon">
              📚
            </div>

            <h3>
              Manage Courses
            </h3>

            <p>
              Add, edit and delete courses.
            </p>

          </Link>



          {/* Manage Students */}

          <Link
            to="/admin/students"
            className="admin-menu-card"
          >

            <div className="admin-menu-icon">
              👨‍🎓
            </div>

            <h3>
              Manage Students
            </h3>

            <p>
              View and manage registered students.
            </p>

          </Link>



          {/* Categories */}

          <Link
            to="/admin/categories"
            className="admin-menu-card"
          >

            <div className="admin-menu-icon">
              🗂️
            </div>

            <h3>
              Categories
            </h3>

            <p>
              Manage course categories.
            </p>

          </Link>



          {/* Reports */}

          <Link
            to="/admin/reports"
            className="admin-menu-card"
          >

            <div className="admin-menu-icon">
              📊
            </div>

            <h3>
              Reports
            </h3>

            <p>
              View learning and enrollment statistics.
            </p>

          </Link>


        </div>

      </div>



      {/* =================================
          RECENT ACTIVITY
      ================================= */}

      <div className="admin-section">

        <h2>
          Recent Activity
        </h2>


        <div className="admin-table-container">

          <table className="admin-table">


            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  Course
                </th>

                <th>
                  Activity
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>



            <tbody>


              <tr>

                <td>
                  Rahul
                </td>

                <td>
                  React JS
                </td>

                <td>
                  Enrolled
                </td>

                <td>

                  <span className="status-active">
                    Active
                  </span>

                </td>

              </tr>



              <tr>

                <td>
                  Priya
                </td>

                <td>
                  Python
                </td>

                <td>
                  Completed Lesson
                </td>

                <td>

                  <span className="status-active">
                    Active
                  </span>

                </td>

              </tr>



              <tr>

                <td>
                  Arun
                </td>

                <td>
                  Java
                </td>

                <td>
                  Enrolled
                </td>

                <td>

                  <span className="status-active">
                    Active
                  </span>

                </td>

              </tr>


            </tbody>

          </table>

        </div>

      </div>


    </div>

  );
}


export default AdminDashboard;