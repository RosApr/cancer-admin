import React from 'react';
import Step from '@/components/step';
import './index.scss';

const currentStep = 2;
export default function DoctorEditSchedule() {
  return (
    <div className='doctor-edit-schedule-layer'>
      <Step defaultCurrent={currentStep} />
    </div>
  );
}
