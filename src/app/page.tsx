"use client"

import { VOLUNTEER_POSITIONS as positions} from '@/constants/volunteer-positions'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Select, { SelectInstance } from 'react-select'

type OptionType = {
  value: string
  label: string
}

export default function VolunteerApplyPage() {
  const params = useSearchParams()
  const positionParam = params.get('position')
  const rolesOptions: OptionType[] = positions.map((position) => ({
    value: position,
    label: position,
  }))

  const initialRole = rolesOptions.find((role) => role.value === positionParam)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [selectedRoles, setSelectedRoles] = useState(initialRole?.value ?? '')
  const [resume, setResume] = useState<File | null>(null)
  const [sending, setSending] = useState(false)

  const selectRef = useRef<SelectInstance | null>(null)

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      alert('Form submitted successfully!')
    }, 1000)
  }

  useEffect(() => {
    if (!selectRef.current || !initialRole) return
    selectRef.current.selectOption(initialRole)
  }, [selectRef.current, initialRole?.value])

  const handlePositionChange = (newValue: unknown) => {
    const selectedRoles = (newValue as OptionType[]).map(
      (option) => option.value,
    )

    const Roles = selectedRoles.join(',')
    setSelectedRoles(Roles)
  }

  return (
    <div className='flex items-center justify-center px-4'>
      <div className='w-full max-w-lg rounded-lg p-6 text-white shadow-lg'>
        <h1 className='mb-4 text-center text-2xl font-bold'>
          Share Your Details
        </h1>
        <p className='mb-6 text-center text-sm text-gray-300'>
          Send us your resume for volunteering opportunities.
        </p>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='flex flex-col sm:flex-row sm:space-x-4'>
            <input
              className='flex-1 rounded-lg border border-gray-600 bg-customDark px-8 py-5 text-white focus:outline-none'
              placeholder='First Name*'
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id='volunteerf-first-name'
            />
            <input
              className='mt-2 flex-1 rounded-lg border border-gray-600 bg-customDark px-8 py-5 text-white focus:outline-none sm:mt-0'
              placeholder='Last Name*'
              type='text'
              value={lastName}
              id='volunteerf-last-name'
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            className='w-full rounded-lg border border-gray-600 bg-customDark px-8 py-5 text-white focus:outline-none'
            placeholder='Email*'
            type='email'
            id='volunteerf-email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <input
              type='hidden'
              name='roles'
              id='volunteerf-roles'
              value={selectedRoles}
            />

            <Select
              ref={selectRef}
              isMulti
              required
              name='roles'
              options={rolesOptions}
              placeholder='Select roles of interest*'
              className='input z-20 mt-[30px] fill-inherit text-left text-black'
              classNamePrefix='react-select'
              onChange={handlePositionChange}
              closeMenuOnSelect={false}
              defaultValue={initialRole}
              components={{
                DropdownIndicator: () => (
                  <div className='mr-2 flex items-center'>
                    <i className='icon-[mdi--arrow-down-drop] text-3xl dark:text-white'></i>
                  </div>
                ),
              }}
              styles={{
                input: (base) => ({
                  ...base,
                  paddingLeft: 10,
                }),
                indicatorSeparator: () => ({ display: 'hidden' }),
              }}
              classNames={{
                control: () => 'select-container',
              }}
            />
          </div>

          <div className='mt-2'>
            <label className='block cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600 focus:outline-none'>
              Upload Resume
              <input
                type='file'
                hidden
                onChange={handleResumeChange}
                accept='.pdf,.doc,.docx'
              />
            </label>
            {resume && (
              <p className='mt-2 text-center text-sm text-gray-300'>
                Selected File: {resume.name}
              </p>
            )}
          </div>

          <textarea
            className='h-32 w-full resize-none rounded-lg border border-gray-600 bg-customDark px-4 py-2 text-white focus:outline-none'
            placeholder='Your message*'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type='submit'
            className={`w-full rounded-lg bg-blue-500 px-8 py-5 font-semibold text-white hover:bg-blue-600 focus:outline-none ${
              !firstName ||
              !lastName ||
              !email ||
              !message ||
              !selectedRoles ||
              !resume
                ? 'cursor-not-allowed opacity-90'
                : ''
            }`}
            disabled={
              !firstName ||
              !lastName ||
              !email ||
              !message ||
              !selectedRoles ||
              !resume
            }
          >
            {sending ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}