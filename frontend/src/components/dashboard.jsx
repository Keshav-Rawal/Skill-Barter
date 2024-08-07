import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../shared/Navbar";
import ForumCards from "./forumCards";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Dashboard = () => {
  const [showSkills, setShowSkills] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDesiredSkills, setSelectedDesiredSkills] = useState([]);
  const [forumPostsList, setForumPostsList] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const skillsRef = useRef(null);
  const locationsRef = useRef(null);
  const forumRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/");
        const data = response.data;

        const skills = new Set();
        const cities = new Set();
        const formattedData = data.map((user) => {
          const emailEncoded = user.email.replace("@", "%40");
          const profilePictureURL = `http://127.0.0.1:8000/api/users/profile-picture/${emailEncoded}/`;

          // Fetch the profile picture using the encoded email
          fetch(profilePictureURL)
            .then((response) => response.json())
            .then((profileData) => {
              const profilePicture = `http://127.0.0.1:8000${profileData.profile_picture}`;
              // Update the user's profile picture
              setForumPostsList((prevPosts) =>
                prevPosts.map((post) =>
                  post.id === user.id ? { ...post, img: profilePicture } : post
                )
              );
            })
            .catch((error) =>
              console.error("Error fetching profile picture:", error)
            );

          skills.add(user.skills);
          cities.add(user.city);
          return {
            id: user.id,
            name: user.full_name,
            location: `${user.city}, ${user.state}`,
            email: user.email, // Ensure the email is included in the profile data
            skills: user.skills ? user.skills.split(", ") : [],
            desiredSkills: user.desired_skills
              ? user.desired_skills.split(", ")
              : [],
            rating: "4.5", // Assuming a default rating as the API does not provide it
            img: "", // Placeholder until the image is fetched
            message: `Looking to exchange ${user.skills} skills for ${user.desired_skills} knowledge.`,
          };
        });
        setSkillsOptions([...skills]);
        setCitiesOptions([...cities]);
        setForumPostsList(formattedData.filter((post) => post.id !== user.id)); // Exclude the logged-in user's own post
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const toggleSkills = () => {
    setShowSkills(!showSkills);
    setShowLocations(false);
    if (!showSkills) {
      setTimeout(() => {
        skillsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const toggleLocations = () => {
    setShowLocations(!showLocations);
    setShowSkills(false);
    if (!showLocations) {
      setTimeout(() => {
        locationsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const handleSkillChange = (e) => {
    setSelectedSkill(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleDesiredSkillsChange = (e) => {
    const { options } = e.target;
    const selectedValues = [];
    for (const option of options) {
      if (option.selected) {
        selectedValues.push(option.value);
      }
    }
    setSelectedDesiredSkills(selectedValues);
  };

  const handleForumSubmit = (e) => {
    e.preventDefault();
    const topic = e.target.forumTopic.value;
    const message = e.target.forumMessage.value;

    if (topic && message) {
      setForumPostsList([
        ...forumPostsList,
        {
          id: forumPostsList.length + 1,
          name: topic,
          location: "Unknown",
          skills: ["Skill1", "Skill2"],
          desiredSkills: selectedDesiredSkills,
          rating: "4.5",
          img: "https://via.placeholder.com/150",
          message,
        },
      ]);
      e.target.reset();
      setSelectedDesiredSkills([]);
    }
  };

  const handleSearchBySkill = () => {
    if (selectedSkill) {
      navigate("/profile-view", {
        state: { searchType: "skill", searchTerm: selectedSkill },
      });
    }
  };

  const handleSearchByLocation = () => {
    if (selectedLocation) {
      navigate("/profile-view", {
        state: { searchType: "location", searchTerm: selectedLocation },
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CustomNavbar />
      <div
        className="d-flex justify-content-center align-items-center text-center"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          color: "black",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            marginBottom: 0,
          }}
        >
          Welcome to
        </h1>
        <h1
          style={{
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            marginTop: 0,
          }}
        >
          <span style={{ color: "black" }}>Skill</span>
          <span style={{ color: "#F83002" }}>Barter</span>
          <span style={{ color: "black" }}>.in</span>
        </h1>
        <p
          className="lead"
          style={{
            fontFamily: "Arial, sans-serif",
            marginTop: 10,
          }}
        >
          <span style={{ color: "#F83002" }}>India</span> ka apna skill
          barteting <span style={{ color: "#F83002" }}>platform</span>
        </p>
        <div className="mt-4 d-flex justify-content-center">
          <button
            className="btn mx-2"
            style={{
              backgroundColor: "#6A38C2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "25px",
              transition: "background-color 0.3s ease",
            }}
            onClick={toggleSkills}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#F83002")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#6A38C2")
            }
          >
            Search by Skill
          </button>
          <button
            className="btn mx-2"
            style={{
              backgroundColor: "#6A38C2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "25px",
              transition: "background-color 0.3s ease",
            }}
            onClick={toggleLocations}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#F83002")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#6A38C2")
            }
          >
            Search by Location
          </button>
        </div>
      </div>

      <div className="container mt-5">
        {showSkills && (
          <div className="mt-4" ref={skillsRef}>
            <h2>Search by Skills</h2>
            <p>Find barter opportunities based on your skills.</p>
            <form>
              <div className="form-group">
                <label htmlFor="skillInput">Select Skill</label>
                <select
                  className="form-control"
                  id="skillInput"
                  value={selectedSkill}
                  onChange={handleSkillChange}
                  style={{ maxWidth: "100%", width: "100%" }}
                >
                  <option value="" disabled>
                    Select a skill
                  </option>
                  {skillsOptions.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary mt-2 w-100"
                onClick={handleSearchBySkill}
                disabled={!selectedSkill}
              >
                Search
              </button>
            </form>
          </div>
        )}
        {showLocations && (
          <div className="mt-4" ref={locationsRef}>
            <h2>Search by Location</h2>
            <p>Find barter opportunities based on your location.</p>
            <form>
              <div className="form-group">
                <label htmlFor="locationInput">Select Location</label>
                <select
                  className="form-control"
                  id="locationInput"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  style={{ maxWidth: "100%", width: "100%" }}
                >
                  <option value="" disabled>
                    Select a location
                  </option>
                  {citiesOptions.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary mt-2 w-100"
                onClick={handleSearchByLocation}
                disabled={!selectedLocation}
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      <ForumCards forumPosts={forumPostsList} />

      <div className="container mt-5" ref={forumRef}>
        <div
          className="mt-5"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "15px",
            marginTop: "20px",
            margin: "auto",
            transition: "max-height 0.3s ease",
            borderRadius: "10px",
            maxWidth: "800px",
          }}
        >
          <h3 className="text-center mb-4">All Forum Posts</h3>
          {forumPostsList.length === 0 ? (
            <p className="text-center">No posts yet. Be the first to post!</p>
          ) : (
            <>
              <ul className="list-group">
                {forumPostsList.map((post, index) => (
                  <li
                    key={index}
                    className="list-group-item"
                    style={{
                      marginBottom: "15px",
                      padding: "20px",
                      transition: "transform 0.3s ease",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate("/full-profile-view", {
                        state: { profile: post },
                      })
                    }
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={post.img}
                        alt="Profile"
                        className="rounded-circle mr-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "15px",
                        }}
                      />
                      <div>
                        <h5>{post.name}</h5>
                        <p>{post.message}</p>
                        <p>
                          <strong>Desired Skills:</strong>{" "}
                          {post.desiredSkills.join(", ")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
