"use client";

import { VOLUNTEER_POSITIONS as positions } from "@/constants/volunteer-positions";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Select, { SelectInstance } from "react-select";
import { mdiChevronDown } from "@mdi/js";
import { env } from "@/server/env";

type OptionType = {
  value: string;
  label: string;
};

export default function VolunteerApplyPage() {
  const params = useSearchParams();
  const positionParam = params.get("position");
  const rolesOptions: OptionType[] = positions.map((position) => ({
    value: position,
    label: position,
  }));

  const initialRole = rolesOptions.find((role) => role.value === positionParam);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(initialRole?.value ?? "");
  const [resume, setResume] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const selectRef = useRef<SelectInstance | null>(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handlePositionChange = (newValue: unknown) => {
    const selectedRoles = (newValue as OptionType[]).map(
      (option) => option.value
    );

    const Roles = selectedRoles.join(",");
    setSelectedRoles(Roles);
  };

  useEffect(() => {
    setIsClient(true);

    const loadRecaptcha = () => {
      if (typeof window !== "undefined" && !window.grecaptcha) {
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${env.GOOGLE_RECAPTCHA_SITE_KEY}`;
        script.onload = () => {
          if (window.grecaptcha) {
            console.log("reCAPTCHA loaded successfully");
            setRecaptchaLoaded(true);
          }
        };
        script.onerror = () => {
          console.error("Error loading reCAPTCHA script");
          alert("Error loading reCAPTCHA. Please try again later.");
        };
        document.head.appendChild(script);
      } else {
        setRecaptchaLoaded(true);
      }
    };

    loadRecaptcha();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    if (recaptchaLoaded && window.grecaptcha) {
      console.log("reCAPTCHA client available, executing...");

      window.grecaptcha
        .execute(env.GOOGLE_RECAPTCHA_SITE_KEY)
        .then(async (token) => {
          console.log("Received reCAPTCHA token:", token);

          const formData = {
            name: `${firstName} ${lastName}`,
            email,
            message,
            roles: selectedRoles,
            resume: resume ? resume.name : "",
            token,
          };

          const res = await fetch("/api/volunteer-recaptcha", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          });

          setSending(false);

          if (res.ok) {
            alert("Form submitted successfully!");
          } else {
            alert("Something went wrong. Please try again.");
          }
        })
        .catch((error: unknown) => {
          setSending(false);
          if (error instanceof Error) {
            console.error("Error during reCAPTCHA execution:", error);
            alert("Error executing reCAPTCHA: " + error.message);
          } else {
            alert("An unknown error occurred during reCAPTCHA execution.");
          }
        });
    } else {
      alert("reCAPTCHA has not loaded properly or is not available.");
    }
  };

  useEffect(() => {
    if (!selectRef.current || !initialRole) return;
    selectRef.current.selectOption(initialRole);
  }, [initialRole]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-lg p-6 text-white shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Share Your Details
        </h1>
        <p className="mb-6 text-center text-sm text-gray-300">
          Send us your resume for volunteering opportunities.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <input
              className="flex-1 rounded-lg border border-gray-600 bg-customDark px-8 py-5 text-white focus:outline-none min-w-0"
              placeholder="First Name*"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="mt-2 flex-1 rounded-lg border border-gray-600 bg-customDark px-8 py-5 text-white focus:outline-none sm:mt-0 min-w-0"
              placeholder="Last Name*"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            className="w-full rounded-lg border border-gray-600 bg-customDark px-8 py-5 text-white focus:outline-none"
            placeholder="Email*"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <Select
              isMulti
              name="roles"
              options={rolesOptions}
              placeholder="Select roles of interest*"
              instanceId="volunteer-roles-select"
              classNamePrefix="react-select"
              onChange={handlePositionChange}
              closeMenuOnSelect={false}
              value={rolesOptions.filter((role) =>
                selectedRoles.includes(role.value)
              )}
              components={{
                DropdownIndicator: () => (
                  <div className="mr-2 flex items-center">
                    <svg className="text-xl text-white" width="24" height="24">
                      <path d={mdiChevronDown} fill="white" />
                    </svg>
                  </div>
                ),
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#121212",
                  color: "white",
                  border: "1px solid gray",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#3b82f6",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  zIndex: 9999,
                }),
                menuList: (provided) => ({
                  ...provided,
                  padding: 0,
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? "rgb(59 130 246)"
                    : "transparent",
                  color: state.isFocused ? "white" : "inherit",
                  padding: "10px 15px",
                  cursor: "pointer",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                input: (base) => ({
                  ...base,
                  color: "white",
                }),
              }}
            />
          </div>
          <div className="mt-2">
            <label className="block cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600 focus:outline-none">
              Upload Resume
              <input
                type="file"
                hidden
                onChange={handleResumeChange}
                accept=".pdf,.doc,.docx"
              />
            </label>
            {resume && (
              <p className="mt-2 text-center text-sm text-gray-300">
                Selected File: {resume.name}
              </p>
            )}
          </div>
          <textarea
            className="h-32 w-full resize-none rounded-lg border border-gray-600 bg-customDark px-4 py-2 text-white focus:outline-none"
            placeholder="Your message*"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="submit"
            className={`w-full rounded-lg bg-blue-500 px-8 py-5 font-semibold text-white hover:bg-blue-600 ${
              sending ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={
              !firstName ||
              !lastName ||
              !email ||
              !message ||
              !selectedRoles ||
              !resume ||
              sending
            }
          >
            {sending ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
