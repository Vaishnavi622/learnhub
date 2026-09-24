import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <h1>
            Learn New Skills.
            <br />
            Build Your Future.
          </h1>

          <p>
            Learn programming, web development, AI,
            databases and more with completely free courses.
          </p>

          <Link to="/courses">
            <button className="primary-btn">
              Explore Courses
            </button>
          </Link>

        </div>

      </section>

      {/* Features */}
      <section className="features">

        <div className="feature">
          <h2>🆓</h2>
          <h3>100% Free</h3>
          <p>
            Access all our courses without any payment.
          </p>
        </div>

        <div className="feature">
          <h2>📚</h2>
          <h3>Learn Anytime</h3>
          <p>
            Learn at your own pace from anywhere.
          </p>
        </div>

        <div className="feature">
          <h2>📈</h2>
          <h3>Track Progress</h3>
          <p>
            Track your learning progress easily.
          </p>
        </div>

      </section>

      {/* Popular Courses */}
      <section className="popular">

        <h2>Popular Courses</h2>

        <p className="section-description">
          Start learning some of our most popular courses.
        </p>

        <div className="popular-courses">

          <div className="popular-card">
            <h3>React JS</h3>
            <p>Learn modern frontend development.</p>
            <span>FREE</span>
          </div>

          <div className="popular-card">
            <h3>Java Programming</h3>
            <p>Learn Java and Object-Oriented Programming.</p>
            <span>FREE</span>
          </div>

          <div className="popular-card">
            <h3>Python</h3>
            <p>Learn Python from basics to projects.</p>
            <span>FREE</span>
          </div>

        </div>

        <Link to="/courses">
          <button className="secondary-btn">
            View All Courses
          </button>
        </Link>

      </section>

    </div>
  );
}

export default Home;