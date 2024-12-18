'use server';

import { prisma } from '@/server/prisma';
import { Prisma } from '@prisma/client';
import { ERROR_TYPES } from './constants/errors';

export async function addApplicant({
    firstName,
    lastName,
    email,
    message,
    selectedRoles,
}: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    selectedRoles: string;
}) {
    try {
        console.log('Payload received:', { firstName, lastName, email, message, selectedRoles }); // Add this line

        // Create new applicant in the database using Prisma
        const newApplicant = await prisma.applicant.create({
            data: {
                firstName,
                lastName,
                email,
                message,
                position: selectedRoles.split(',').map((role) => role.trim()),
                platform: [],
                coverLetter: '',
                resume: '',
                notes: '',
                lastFollowUpDate: null,
                availabilityDate: null,
                interviewDate: null,
                interviewTime: null,
                offerDate: null,
            },
        });

        return { success: true, applicant: newApplicant };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === ERROR_TYPES.DUPLICATE_EMAIL.Code) {
            throw new Error(ERROR_TYPES.DUPLICATE_EMAIL.Message);
          }
        }
       // throw new Error('Something went wrong');
      }
}
