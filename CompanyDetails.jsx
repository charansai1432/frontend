import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import DOMPurify from "dompurify";
import { COMPANY_API_END_POINT, RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/admin/Navbar";
import {
  fetchCompanyStats,
  fetchRecruiterStats,
  fetchJobStats,
  fetchApplicationStats,
} from "@/redux/admin/statsSlice";

const CompanyDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dloading, dSetLoading] = useState(false);
  const [company, setCompany] = useState(null);

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.post(
        `${COMPANY_API_END_POINT}/company-by-id`,
        { companyId },
        { withCredentials: true }
      );
      if (response.data.success) {
        setCompany(response.data.company);
      }
    } catch (err) {
      console.error(`Error fetching company: ${err}`);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const handleDeleteCompany = async () => {
    try {
      dSetLoading(true);
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: {
          userEmail: user?.emailId?.email,
          companyId,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(fetchCompanyStats());
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());
        dispatch(fetchApplicationStats());
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error("Error deleting company. Try again later.");
    } finally {
      dSetLoading(false);
    }
  };

  // Secure URL function with strict validation
  const getSafeUrl = useMemo(() => (url) => {
    if (!url) return "#"; // Default safe value

    try {
      const decodedUrl = decodeURIComponent(url);
      const sanitizedUrl = DOMPurify.sanitize(decodedUrl);
      const safeUrl = new URL(sanitizedUrl, window.location.origin);

      if (["http:", "https:"].includes(safeUrl.protocol)) {
        return safeUrl.href;
      }
    } catch (error) {
      console.warn("Invalid URL:", url);
    }

    return "#"; // Fallback to prevent issues
  }, []);

  return (
    <>
      <Navbar linkName={"Company Details"} />
      <div className="max-w-6xl mx-auto p-8 m-4 bg-white rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Company Details
        </h1>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="info-card">
              <p className="text-sm text-gray-500 font-medium">Company Name</p>
              <p className="text-xl text-gray-800 font-semibold">
                {company?.companyName}
              </p>
            </div>
            <div className="info-card">
              <p className="text-sm text-gray-500 font-medium">Website</p>
              <a
                href={getSafeUrl(company?.companyWebsite)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xl font-semibold"
              >
                {company?.companyWebsite}
              </a>
            </div>
            <div className="info-card">
              <p className="text-sm text-gray-500 font-medium">Business File</p>
              <a
                href={getSafeUrl(company?.businessFile)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xl font-semibold"
              >
                View Business File
              </a>
            </div>
          </div>

          <div className="flex justify-end space-x-6 mt-8">
            <button
              onClick={() => navigate(`/admin/recruiters/${companyId}`)}
              className="px-6 py-3 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition"
            >
              Recruiters List
            </button>
            <button
              onClick={handleDeleteCompany}
              className={`px-6 py-3 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200 ${
                dloading && "cursor-not-allowed"
              }`}
              disabled={dloading}
            >
              {dloading ? "Deleting..." : "Delete Company"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
