import React, { useEffect, useState } from "react";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineVerified, MdOutlineVerifiedUser } from "react-icons/md";
import RecruiterJobs from "./RecruiterJobs";
import Navbar from "@/components/admin/Navbar";
import { Button } from "@/components/ui/button";

// Function to validate image URL
const isValidImageUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return /\.(jpeg|jpg|png|webp|gif)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};

const RecruitersDetails = () => {
  const [loading, setLoading] = useState(false);
  const [recruiterDetails, setRecruiterDetails] = useState(null);
  const { recruiterId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchRecruiterDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${RECRUITER_API_END_POINT}/recruiter-by-id/${recruiterId}`
      );
      setRecruiterDetails(response.data.recruiter);
    } catch (err) {
      console.error("Error fetching recruiter details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user?.role === "student") {
      navigate("/login");
    } else {
      fetchRecruiterDetails();
    }
  }, [user]);

  // Secure profile image selection
  const profileImage =
    recruiterDetails?.profile?.profilePhoto && isValidImageUrl(recruiterDetails.profile.profilePhoto)
      ? encodeURI(recruiterDetails.profile.profilePhoto)
      : "https://github.com/shadcn.png"; // Default Image

  return (
    <>
      {user?.role !== "recruiter" && <Navbar linkName={"Recruiter Details"} />}
      <div className="flex flex-col md:flex-row gap-2 p-6">
        {loading ? (
          <div className="text-xl font-semibold">Loading...</div>
        ) : recruiterDetails ? (
          <>
            <div className="bg-white p-8 w-full md:w-1/3 rounded-lg shadow-lg flex flex-col space-y-2 h-fit">
              <img
                src={profileImage}
                alt={`${recruiterDetails?.fullname || "Recruiter"}'s profile`}
                className="w-32 h-32 rounded-full mx-auto"
              />

              <h2 className="text-3xl text-center font-bold">
                {recruiterDetails?.fullname || "N/A"}
              </h2>
              <p className="text-gray-700 flex items-center gap-2">
                <span>
                  <strong>Email:</strong> {recruiterDetails?.emailId?.email || "N/A"}
                </span>
                <span className="text-green-600">
                  {recruiterDetails?.emailId?.isVerified ? (
                    <MdOutlineVerified size={25} />
                  ) : (
                    "No"
                  )}
                </span>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <span>
                  <strong>Phone Number:</strong>{" "}
                  {recruiterDetails?.phoneNumber?.number || "N/A"}
                </span>
                {recruiterDetails?.phoneNumber?.number && (
                  <span
                    className={`${
                      recruiterDetails?.phoneNumber?.isVerified
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {recruiterDetails?.phoneNumber?.isVerified ? (
                      <MdOutlineVerified size={25} />
                    ) : (
                      "No"
                    )}
                  </span>
                )}
              </p>
              <p className="text-gray-700">
                <strong>Position:</strong> {recruiterDetails?.position || "Not specified"}
              </p>
              <p className="text-gray-700">
                <strong>Company Created:</strong>{" "}
                {recruiterDetails?.isCompanyCreated ? "Yes" : "No"}
              </p>
              <p className="text-gray-700">
                <strong>Account Status:</strong>{" "}
                <span
                  className={`${
                    recruiterDetails?.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {recruiterDetails?.isActive ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <strong>Verification Status:</strong>{" "}
                <span
                  className={`${
                    recruiterDetails?.isVerify ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {recruiterDetails?.isVerify ? (
                    <MdOutlineVerifiedUser size={25} />
                  ) : (
                    "Not Verified"
                  )}
                </span>
              </p>
              <p className="text-gray-700">
                <strong>Role:</strong> {recruiterDetails?.role || "N/A"}
              </p>
              {user?.role !== "recruiter" && (
                <div className="flex justify-end">
                  <Button
                    className="bg-blue-700 hover:bg-blue-800"
                    onClick={() =>
                      navigate(`/admin/for-admin/company-details/${recruiterDetails?._id}`)
                    }
                  >
                    Company Details
                  </Button>
                </div>
              )}
            </div>
            <div className="w-2/3">
              <RecruiterJobs recruiterId={recruiterId} />
            </div>
          </>
        ) : (
          <div className="text-xl font-semibold">No details found</div>
        )}
      </div>
    </>
  );
};

export default RecruitersDetails;
