import React, { useEffect, useState } from "react";
import ApplicationList from "./ApplicationList";
import Navbar from "@/components/admin/Navbar";
import { Badge } from "../../../components/ui/badge";
import { useParams } from "react-router-dom";
import { ADMIN_USER_DATA_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";

// Function to validate and sanitize URL
const getSafeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol) ? url : "#";
  } catch {
    return "#";
  }
};

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const response = await axios.get(
          `${ADMIN_USER_DATA_API_END_POINT}/getUser/${userId}`
        );
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.error(`Error fetching user data: ${err}`);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchApplications = async () => {
      try {
        setLoadingApps(true);
        const response = await axios.get(
          `${ADMIN_USER_DATA_API_END_POINT}/user-all-application/${userId}`
        );
        if (response.data.success) {
          setApplications(response.data.data);
        }
      } catch (err) {
        console.error(`Error fetching applications: ${err}`);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchUser();
    fetchApplications();
  }, [userId]);

  return (
    <>
      <Navbar linkName="User Details" />
      <div className="flex shadow-md rounded-lg flex-col md:flex-row bg-white m-4 p-4">
        {loadingUser ? (
          <p className="text-2xl text-blue-700">Loading user details...</p>
        ) : user ? (
          <div className="md:w-1/3 border-r-2 border-gray-300 md:pr-6">
            <div className="flex flex-col items-center">
              <img
                src={getSafeUrl(user.profile?.profilePhoto) || "/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => (e.target.src = "/default-profile.png")}
              />
              <h2 className="mt-4 text-2xl font-bold">{user.fullname || "Unknown User"}</h2>
              <p className="text-gray-600">{user.emailId?.email || "No email available"}</p>
            </div>

            {/* Contact Information */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Contact Information</h3>
              <p>
                <span className="font-medium">Phone:</span> {user.phoneNumber?.number || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span> {user.address?.city || "N/A"}, {user.address?.state || "N/A"}, {user.address?.country || "N/A"}
              </p>
            </div>

            {/* About Me Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold">About Me</h3>
              <p className="text-gray-700">{user.profile?.bio || "No bio available"}</p>
            </div>

            {/* Professional Details */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Professional Details</h3>

              {user.profile?.coverLetter && (
                <div className="mt-2">
                  <h4 className="text-lg font-semibold">Cover Letter</h4>
                  <p className="text-gray-700 h-24 overflow-y-scroll p-2">{user.profile.coverLetter}</p>
                </div>
              )}

              {user.profile?.experience && (
                <div className="mt-2">
                  <h4 className="text-lg font-semibold">Experience</h4>
                  <p>
                    <span className="font-bold">Company:</span> {user.profile.experience.companyName || "N/A"}
                  </p>
                  <p>
                    <span className="font-bold">Job Profile:</span> {user.profile.experience.jobProfile || "N/A"}
                  </p>
                  <p>
                    <span className="font-bold">Duration:</span> {user.profile.experience.duration || "N/A"}
                  </p>
                  <span className="font-bold">Details:</span>
                  <p className="h-28 overflow-y-scroll">{user.profile.experience.experienceDetails || "No details provided"}</p>
                </div>
              )}

              {/* Skills Section */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {user.profile?.skills?.length > 0 ? (
                    user.profile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-blue-100 hover:bg-gray-200 px-4 py-2 text-blue-800 rounded-lg font-medium text-sm"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-600">No skills listed</span>
                  )}
                </div>
              </div>

              {/* Resume Section */}
              {user.profile?.resume && (
                <div className="mt-2">
                  <h4 className="text-lg font-semibold">Resume</h4>
                  <a
                    href={getSafeUrl(user.profile.resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {user.profile.resumeOriginalName || "View Resume"}
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-2xl text-red-500">User data not available</p>
        )}

        {/* Application List Section */}
        <div className="md:w-2/3 mt-6 md:mt-0 md:pl-6">
          {loadingApps ? (
            <p className="text-2xl text-blue-700">Loading applications...</p>
          ) : (
            <ApplicationList applications={applications} />
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;
