import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useForm, useValidation } from '../hooks/useForm';
import { FormInput, FormSelect, FormTextarea, FormCheckbox, FormButton, FormMessage, FormRow, FormColumn } from '../components/ui/FormComponents';
import { submitAdmissionsEnquiry } from '../utils/storage';
import '../assets/css/professional.css';

const FormSection = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: '28px', padding: '30px 35px', marginBottom: '20px', border: '1px solid #e8e8e8', boxShadow: '0 3px 16px rgba(0,0,0,0.06)' }}>
    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '17px', fontWeight: '700', color: '#1a1a1a', borderBottom: '2px solid #c9a84c', paddingBottom: '10px', marginBottom: '22px' }}>{title}</p>
    {children}
  </div>
);

const FormFileUpload = ({ label, name, onChange, error, accept, required = false, fileName }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '7px' }}>
      {label} {required && <span style={{ color: '#c0392b' }}>*</span>}
    </label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      accept={accept}
      style={{
        width: '100%',
        padding: '11px 18px',
        border: '1.5px solid #e0e0e0',
        borderRadius: '35px',
        fontSize: '13.5px',
        fontFamily: "'Poppins',sans-serif",
        background: '#fafafa',
        outline: 'none',
        cursor: 'pointer'
      }}
    />
    {fileName && <span style={{ display: 'block', fontSize: '12px', color: '#2ecc71', marginTop: '5px', paddingLeft: '10px' }}>✓ {fileName}</span>}
    {error && <span style={{ display: 'block', fontSize: '11.5px', color: '#c0392b', fontWeight: '500', marginTop: '5px', paddingLeft: '10px' }}>{error}</span>}
    <span style={{ display: 'block', fontSize: '11px', color: '#888', marginTop: '5px', paddingLeft: '10px' }}>Max 2MB | Formats: {accept}</span>
  </div>
);

function AdmissionsPage() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [files, setFiles] = useState({
    photo: null,
    aadhar: null,
    tenthMarksheet: null,
    twelfthMarksheet: null,
    transferCertificate: null,
    communityCertificate: null
  });
  const [fileErrors, setFileErrors] = useState({});
  const validation = useValidation();
  
  const form = useForm({
    firstName: '', lastName: '', dob: '', gender: '', religion: '', community: '', nationality: '', bloodGroup: '',
    aadharNumber: '', address: '', city: '', state: '', pincode: '',
    mobile: '', email: '', parentName: '', parentOccupation: '', parentIncome: '', parentMobile: '', parentEmail: '',
    schoolName: '', tenthBoard: '', tenthPercent: '', tenthYearPassing: '',
    collegeName: '', twelfthBoard: '', twelfthPercent: '', twelfthPhysics: '', twelfthChemistry: '', twelfthMaths: '', yearPassing: '', tneaNo: '',
    department: '', admissionType: '', hostelRequired: 'no', transportRequired: 'no',
    declare: false
  });

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFileErrors(prev => ({ ...prev, [name]: 'File size must be less than 2MB' }));
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setFileErrors(prev => ({ ...prev, [name]: 'Only JPG, PNG, or PDF files allowed' }));
        return;
      }
      
      setFiles(prev => ({ ...prev, [name]: file }));
      setFileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const newFileErrors = {};
    
    if (!form.values.firstName) newErrors.firstName = 'First name is required';
    if (!form.values.lastName) newErrors.lastName = 'Last name is required';
    if (!form.values.dob) newErrors.dob = 'Date of birth is required';
    if (!form.values.gender) newErrors.gender = 'Gender is required';
    if (!form.values.community) newErrors.community = 'Community is required';
    if (!form.values.nationality) newErrors.nationality = 'Nationality is required';
    if (!form.values.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    
    if (!form.values.aadharNumber) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(form.values.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar must be 12 digits';
    }
    
    if (!form.values.address) newErrors.address = 'Address is required';
    if (!form.values.city) newErrors.city = 'City is required';
    if (!form.values.state) newErrors.state = 'State is required';
    
    if (!form.values.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(form.values.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    const mobileError = validation.validatePhone(form.values.mobile);
    if (mobileError) newErrors.mobile = mobileError;
    
    const emailError = validation.validateEmail(form.values.email);
    if (emailError) newErrors.email = emailError;
    
    if (!form.values.parentName) newErrors.parentName = 'Parent name is required';
    if (!form.values.parentOccupation) newErrors.parentOccupation = 'Parent occupation is required';
    if (!form.values.parentIncome) newErrors.parentIncome = 'Parent income is required';
    
    const parentMobileError = validation.validatePhone(form.values.parentMobile);
    if (parentMobileError) newErrors.parentMobile = parentMobileError;
    
    if (!form.values.schoolName) newErrors.schoolName = '10th school name is required';
    if (!form.values.tenthBoard) newErrors.tenthBoard = '10th board is required';
    if (!form.values.tenthPercent) newErrors.tenthPercent = '10th percentage is required';
    if (!form.values.tenthYearPassing) newErrors.tenthYearPassing = '10th year is required';
    if (!form.values.collegeName) newErrors.collegeName = '12th college name is required';
    if (!form.values.twelfthBoard) newErrors.twelfthBoard = '12th board is required';
    if (!form.values.twelfthPercent) newErrors.twelfthPercent = '12th percentage is required';
    if (!form.values.twelfthPhysics) newErrors.twelfthPhysics = 'Physics marks required';
    if (!form.values.twelfthChemistry) newErrors.twelfthChemistry = 'Chemistry marks required';
    if (!form.values.twelfthMaths) newErrors.twelfthMaths = 'Maths marks required';
    if (!form.values.yearPassing) newErrors.yearPassing = 'Year of passing is required';
    if (!form.values.department) newErrors.department = 'Department is required';
    if (!form.values.admissionType) newErrors.admissionType = 'Admission type is required';
    
    if (!files.photo) newFileErrors.photo = 'Passport photo is required';
    if (!files.aadhar) newFileErrors.aadhar = 'Aadhar card is required';
    if (!files.tenthMarksheet) newFileErrors.tenthMarksheet = '10th marksheet is required';
    if (!files.twelfthMarksheet) newFileErrors.twelfthMarksheet = '12th marksheet is required';
    if (!files.transferCertificate) newFileErrors.transferCertificate = 'Transfer certificate is required';
    if (form.values.community !== 'oc' && !files.communityCertificate) {
      newFileErrors.communityCertificate = 'Community certificate is required';
    }
    
    if (!form.values.declare) newErrors.declare = 'Please agree to declaration';

    form.setErrors(newErrors);
    setFileErrors(newFileErrors);
    
    if (Object.keys(newErrors).length > 0 || Object.keys(newFileErrors).length > 0) {
      setMessage({ type: 'error', text: 'Please fill all required fields and upload necessary documents.' });
      window.scrollTo(0, 0);
      return;
    }
    
    // Save FULL application data to backend
    let finalAppId = 'APP' + Date.now();
    try {
      const enquiryData = {
        name: `${form.values.firstName} ${form.values.lastName}`,
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        email: form.values.email,
        phone: form.values.mobile,
        gender: form.values.gender,
        dob: form.values.dob,
        religion: form.values.religion,
        community: form.values.community,
        nationality: form.values.nationality,
        bloodGroup: form.values.bloodGroup,
        aadharNumber: form.values.aadharNumber,
        address: form.values.address,
        city: form.values.city,
        state: form.values.state,
        pincode: form.values.pincode,
        parentName: form.values.parentName,
        parentOccupation: form.values.parentOccupation,
        parentIncome: form.values.parentIncome,
        parentMobile: form.values.parentMobile,
        parentEmail: form.values.parentEmail,
        schoolName: form.values.schoolName,
        tenthBoard: form.values.tenthBoard,
        tenthPercent: form.values.tenthPercent,
        tenthYearPassing: form.values.tenthYearPassing,
        collegeName: form.values.collegeName,
        twelfthBoard: form.values.twelfthBoard,
        twelfthPercent: form.values.twelfthPercent,
        twelfthPhysics: form.values.twelfthPhysics,
        twelfthChemistry: form.values.twelfthChemistry,
        twelfthMaths: form.values.twelfthMaths,
        yearPassing: form.values.yearPassing,
        tneaNo: form.values.tneaNo,
        department: form.values.department,
        admissionType: form.values.admissionType,
        hostelRequired: form.values.hostelRequired,
        transportRequired: form.values.transportRequired,
        status: 'Pending',
        type: 'admission',
        date: new Date().toISOString().split('T')[0],
      };
      const result = await submitAdmissionsEnquiry(enquiryData);
      if (result && result.appId) finalAppId = result.appId;
    } catch (err) {
      console.warn('Could not save admission to server:', err);
    }

    setMessage({ type: 'success', text: `✅ Application submitted successfully! Your Application ID: ${finalAppId}. The admin will review your application and contact you soon.` });
    form.resetForm();
    setFiles({
      photo: null,
      aadhar: null,
      tenthMarksheet: null,
      twelfthMarksheet: null,
      transferCertificate: null,
      communityCertificate: null
    });
    window.scrollTo(0, 0);
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const communityOptions = [
    { value: 'oc', label: 'OC' },
    { value: 'bc', label: 'BC' },
    { value: 'mbc', label: 'MBC' },
    { value: 'sc', label: 'SC' },
    { value: 'st', label: 'ST' }
  ];
  const boardOptions = [
    { value: 'cbse', label: 'CBSE' },
    { value: 'stateboard', label: 'Tamil Nadu State Board' },
    { value: 'icse', label: 'ICSE' },
    { value: 'other', label: 'Other' }
  ];
  const yearOptions = ['2025', '2024', '2023', '2022', '2021'];
  const departmentOptions = [
    { value: 'cse', label: 'B.E. Computer Science Engineering' },
    { value: 'ece', label: 'B.E. Electronics & Communication' },
    { value: 'mech', label: 'B.E. Mechanical Engineering' },
    { value: 'civil', label: 'B.E. Civil Engineering' },
    { value: 'it', label: 'B.E. Information Technology' },
    { value: 'bio', label: 'B.E. Biotechnology' }
  ];
  const admissionTypeOptions = [
    { value: 'tnea', label: 'TNEA Counselling' },
    { value: 'management', label: 'Management Quota' },
    { value: 'nri', label: 'NRI Quota' }
  ];
  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '780px', margin: '30px auto 40px', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: '28px', padding: '28px 35px', marginBottom: '20px', border: '1px solid #e8e8e8', boxShadow: '0 3px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', fontWeight: '800', color: '#1a1a1a', marginBottom: '6px' }}>Admission Application Form</h2>
          <p style={{ fontSize: '13px', color: '#888', fontWeight: '300' }}>Complete all sections and upload required documents for admission 2025-26</p>
        </div>

        <FormMessage type={message.type} message={message.text} />

        <form onSubmit={handleSubmit}>
          <FormSection title="Personal Details">
            <FormRow>
              <FormColumn>
                <FormInput label="First Name" name="firstName" value={form.values.firstName} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.firstName} touched={form.touched.firstName} placeholder="Enter first name" required />
              </FormColumn>
              <FormColumn>
                <FormInput label="Last Name" name="lastName" value={form.values.lastName} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.lastName} touched={form.touched.lastName} placeholder="Enter last name" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Date of Birth" name="dob" type="date" value={form.values.dob} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.dob} touched={form.touched.dob} required />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Gender" name="gender" value={form.values.gender} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.gender} touched={form.touched.gender} options={genderOptions} placeholder="Select gender" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Nationality" name="nationality" value={form.values.nationality} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.nationality} touched={form.touched.nationality} placeholder="Enter nationality" required />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Blood Group" name="bloodGroup" value={form.values.bloodGroup} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.bloodGroup} touched={form.touched.bloodGroup} options={bloodGroupOptions} placeholder="Select blood group" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Religion" name="religion" value={form.values.religion} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="Enter religion" />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Community" name="community" value={form.values.community} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.community} touched={form.touched.community} options={communityOptions} placeholder="Select community" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Aadhar Number" name="aadharNumber" value={form.values.aadharNumber} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.aadharNumber} touched={form.touched.aadharNumber} placeholder="12-digit Aadhar number" maxLength="12" required />
              </FormColumn>
            </FormRow>
            <FormTextarea label="Permanent Address" name="address" value={form.values.address} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.address} touched={form.touched.address} rows={3} placeholder="Enter full address" required />
            <FormRow>
              <FormColumn>
                <FormInput label="City" name="city" value={form.values.city} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.city} touched={form.touched.city} placeholder="Enter city" required />
              </FormColumn>
              <FormColumn>
                <FormInput label="State" name="state" value={form.values.state} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.state} touched={form.touched.state} placeholder="Enter state" required />
              </FormColumn>
              <FormColumn>
                <FormInput label="Pincode" name="pincode" value={form.values.pincode} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.pincode} touched={form.touched.pincode} placeholder="6-digit pincode" maxLength="6" required />
              </FormColumn>
            </FormRow>
          </FormSection>

          <FormSection title="Contact Details">
            <FormRow>
              <FormColumn>
                <FormInput label="Mobile Number" name="mobile" value={form.values.mobile} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.mobile} touched={form.touched.mobile} placeholder="10-digit mobile number" maxLength="10" required />
              </FormColumn>
              <FormColumn>
                <FormInput label="Email Address" name="email" type="email" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.email} touched={form.touched.email} placeholder="your@email.com" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Parent/Guardian Name" name="parentName" value={form.values.parentName} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.parentName} touched={form.touched.parentName} placeholder="Enter parent name" required />
              </FormColumn>
              <FormColumn>
                <FormInput label="Parent Occupation" name="parentOccupation" value={form.values.parentOccupation} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.parentOccupation} touched={form.touched.parentOccupation} placeholder="Enter occupation" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Parent Annual Income" name="parentIncome" value={form.values.parentIncome} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.parentIncome} touched={form.touched.parentIncome} placeholder="e.g. 500000" required />
              </FormColumn>
              <FormColumn>
                <FormInput label="Parent Mobile" name="parentMobile" value={form.values.parentMobile} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.parentMobile} touched={form.touched.parentMobile} placeholder="10-digit mobile" maxLength="10" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Parent Email (Optional)" name="parentEmail" type="email" value={form.values.parentEmail} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="parent@email.com" />
              </FormColumn>
            </FormRow>
          </FormSection>

          <FormSection title="10th Standard Details">
            <FormRow>
              <FormColumn>
                <FormInput label="School Name" name="schoolName" value={form.values.schoolName} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.schoolName} touched={form.touched.schoolName} placeholder="Enter school name" required />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Board" name="tenthBoard" value={form.values.tenthBoard} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.tenthBoard} touched={form.touched.tenthBoard} options={boardOptions} placeholder="Select board" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Percentage / CGPA" name="tenthPercent" value={form.values.tenthPercent} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.tenthPercent} touched={form.touched.tenthPercent} placeholder="e.g. 85.5" required />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Year of Passing" name="tenthYearPassing" value={form.values.tenthYearPassing} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.tenthYearPassing} touched={form.touched.tenthYearPassing} options={yearOptions} placeholder="Select year" required />
              </FormColumn>
            </FormRow>
          </FormSection>

          <FormSection title="12th Standard Details">
            <FormRow>
              <FormColumn>
                <FormInput label="College Name" name="collegeName" value={form.values.collegeName} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.collegeName} touched={form.touched.collegeName} placeholder="Enter college name" required />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Board" name="twelfthBoard" value={form.values.twelfthBoard} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.twelfthBoard} touched={form.touched.twelfthBoard} options={boardOptions} placeholder="Select board" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Overall Percentage" name="twelfthPercent" value={form.values.twelfthPercent} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.twelfthPercent} touched={form.touched.twelfthPercent} placeholder="e.g. 88.5" required />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Year of Passing" name="yearPassing" value={form.values.yearPassing} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.yearPassing} touched={form.touched.yearPassing} options={yearOptions} placeholder="Select year" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="Physics Marks" name="twelfthPhysics" value={form.values.twelfthPhysics} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.twelfthPhysics} touched={form.touched.twelfthPhysics} placeholder="e.g. 95" required />
              </FormColumn>
              <FormColumn>
                <FormInput label="Chemistry Marks" name="twelfthChemistry" value={form.values.twelfthChemistry} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.twelfthChemistry} touched={form.touched.twelfthChemistry} placeholder="e.g. 92" required />
              </FormColumn>
              <FormColumn>
                <FormInput label="Maths Marks" name="twelfthMaths" value={form.values.twelfthMaths} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.twelfthMaths} touched={form.touched.twelfthMaths} placeholder="e.g. 98" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormInput label="TNEA Application No (Optional)" name="tneaNo" value={form.values.tneaNo} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="Enter TNEA number" />
              </FormColumn>
            </FormRow>
          </FormSection>

          <FormSection title="Course Selection & Additional">
            <FormRow>
              <FormColumn>
                <FormSelect label="Preferred Department" name="department" value={form.values.department} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.department} touched={form.touched.department} options={departmentOptions} placeholder="Select department" required />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Admission Type" name="admissionType" value={form.values.admissionType} onChange={form.handleChange} onBlur={form.handleBlur} error={form.errors.admissionType} touched={form.touched.admissionType} options={admissionTypeOptions} placeholder="Select type" required />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormSelect label="Hostel Required?" name="hostelRequired" value={form.values.hostelRequired} onChange={form.handleChange} onBlur={form.handleBlur} options={yesNoOptions} />
              </FormColumn>
              <FormColumn>
                <FormSelect label="Transport Required?" name="transportRequired" value={form.values.transportRequired} onChange={form.handleChange} onBlur={form.handleBlur} options={yesNoOptions} />
              </FormColumn>
            </FormRow>
          </FormSection>

          <FormSection title="Document Upload">
            <FormRow>
              <FormColumn>
                <FormFileUpload label="Passport Photo" name="photo" onChange={handleFileChange} error={fileErrors.photo} accept=".jpg,.jpeg,.png" required fileName={files.photo?.name} />
              </FormColumn>
              <FormColumn>
                <FormFileUpload label="Aadhar Card" name="aadhar" onChange={handleFileChange} error={fileErrors.aadhar} accept=".jpg,.jpeg,.png,.pdf" required fileName={files.aadhar?.name} />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormFileUpload label="10th Marksheet" name="tenthMarksheet" onChange={handleFileChange} error={fileErrors.tenthMarksheet} accept=".jpg,.jpeg,.png,.pdf" required fileName={files.tenthMarksheet?.name} />
              </FormColumn>
              <FormColumn>
                <FormFileUpload label="12th Marksheet" name="twelfthMarksheet" onChange={handleFileChange} error={fileErrors.twelfthMarksheet} accept=".jpg,.jpeg,.png,.pdf" required fileName={files.twelfthMarksheet?.name} />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <FormFileUpload label="Transfer Certificate" name="transferCertificate" onChange={handleFileChange} error={fileErrors.transferCertificate} accept=".jpg,.jpeg,.png,.pdf" required fileName={files.transferCertificate?.name} />
              </FormColumn>
              <FormColumn>
                <FormFileUpload label="Community Certificate" name="communityCertificate" onChange={handleFileChange} error={fileErrors.communityCertificate} accept=".jpg,.jpeg,.png,.pdf" required={form.values.community !== 'oc'} fileName={files.communityCertificate?.name} />
              </FormColumn>
            </FormRow>
          </FormSection>

          <FormSection title="Declaration">
            <FormCheckbox
              label="I hereby declare that all information provided above is true and correct. I understand that any false information may lead to cancellation of admission."
              name="declare"
              checked={form.values.declare}
              onChange={form.handleChange}
              error={form.errors.declare}
              touched={form.touched.declare}
            />
          </FormSection>

          <FormButton type="submit" style={{ width: '100%' }}>Submit Application</FormButton>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default AdmissionsPage;
