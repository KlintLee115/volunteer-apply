import {prisma} from '@/server/prisma'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {const request = await req.json();
    console.log(request);
 
    const { firstName, lastName, email, message, selectedRoles } = request;

    // Create new applicant in the database using Prisma
    const newApplicant = await prisma.applicant.create({
        data: {
          firstName:firstName,                          
          lastName:lastName,                           
          email:email,                            
          message: message,                            
          position: selectedRoles
          .split(',')
          .map((role: string) => role.trim()),
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
      
    return NextResponse.json({ success: true, applicant: newApplicant }, { status: 201 });
  } catch (error) {
    console.log('Error adding applicant:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
 ;
  
} 