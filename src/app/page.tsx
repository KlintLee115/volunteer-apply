"use client";

import { addApplicant } from "@/actions";
import { VOLUNTEER_POSITIONS as positions } from "@/constants/volunteer-positions";
import { useSearchParams } from "next/navigation";
import { HTMLInputTypeAttribute, useState } from "react";
import Select, { MultiValue } from "react-select";

type OptionType = {
  value: string;
  label: string;
};

interface formFields {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  selectedRoles: string;
  resume: File | null;
}

export default function VolunteerApplyPage() {
  const params = useSearchParams();
  const positionParam = params.get("position");
  const rolesOptions: OptionType[] = positions.map((p) => ({ value: p, label: p }))

  const initialRole = rolesOptions.find((role) => role.value === positionParam);

  const [formData, setFormData] = useState<formFields>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    selectedRoles: initialRole?.value || "",
    resume: null as File | null,
  });
  const [sending, setSending] = useState(false)

  const handleChange = <K extends keyof formFields>(field: K, value: formFields[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValidResume = (resume: File | null) => 
    resume && ["application/pdf", "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(resume.type) && 
    resume.size <= 5 * 1024 * 1024;
  
  const validateForm = () => {
    return Object.values(formData).every((val) => val) && isValidResume(formData.resume);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB.");
      } else {
        handleChange("resume", file);
      }
    }
  };

  const handlePositionChange = (newValue: MultiValue<OptionType>) => {
    const selectedRoles = newValue.map((option) => option.value).join(",");
    handleChange("selectedRoles", selectedRoles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return alert("Invalid form data");

    setSending(true);

    try {
      const response = await addApplicant(formData);


      if (response.success) {
        alert("Form submitted successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "", selectedRoles: "", resume: null });

      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-lg rounded-lg p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">Share Your Details</h1>
        <p className="mb-6 text-center text-sm text-gray-300">
          Send us your resume for volunteering opportunities.
        </p>
        <form className="space-y-4 text-black" onSubmit={handleSubmit}>
          {/* First and Last Name */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <Input
              label="First Name*"
              value={formData.firstName}
              onChange={(v) => handleChange("firstName", v)}
              id="volunteerf-first-name"
            />
            <Input
              label="Last Name*"
              value={formData.lastName}
              onChange={(value) => handleChange("lastName", value)}
              id="volunteerf-last-name"
            />
          </div>

          {/* Email */}
          <Input
            label="Email*"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            id="volunteerf-email"
          />

          {/* Roles */}
          <Select
            isMulti
            instanceId="my-select"
            name="roles"
            options={rolesOptions}
            placeholder="Select roles of interest*"
            className="input z-20 mt-2 text-black"
            classNamePrefix="react-select"
            onChange={handlePositionChange}
            closeMenuOnSelect={false}
            defaultValue={initialRole}
          />

          {/* Resume Upload */}
          <div className="mt-2">
            <label className="block cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600">
              Upload Resume
              <input
                type="file"
                hidden
                onChange={handleResumeChange}
                accept=".pdf,.doc,.docx"
              />
            </label>
            {formData.resume && (
              <p className="mt-2 text-center text-sm text-gray-300">
                Selected File: {formData.resume.name}
              </p>
            )}
          </div>

          {/* Message */}
          <Textarea
            label="Your message*"
            value={formData.message}
            onChange={(value) => handleChange("message", value)}

          />

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full rounded-lg bg-blue-500 px-8 py-5 font-semibold text-white hover:bg-blue-600 ${sending || !validateForm() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={sending || !validateForm()}
          >
            {sending ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Reusable Input Component
function Input({
  label,
  type = "text",
  value,
  onChange,
  id,
}: {
  label: string;
  type?: HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-sm font-semibold text-gray-300 mb-1">
        {label}
      </label>
      <input
        className="w-full rounded-lg border border-gray-600 bg-customDark px-4 py-2 focus:outline-none"
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// Reusable Textarea Component
function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-semibold text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        className="h-32 w-full resize-none rounded-lg border border-gray-600 bg-customDark px-4 py-2 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
