import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../assets/css/style.css';

const labs = [
  ['💻', 'Computer Science Lab', '300+ high-end workstations with latest software for programming, AI and ML'],
  ['📡', 'Electronics Lab', 'VLSI design tools, oscilloscopes, signal generators and embedded kits'],
  ['⚙️', 'Mechanical Workshop', 'CNC machines, 3D printers, lathe machines and fabrication tools'],
  ['🏗️', 'Civil Survey Lab', 'Total stations, theodolites, GPS survey equipment and material testing'],
  ['🔬', 'Biotechnology Lab', 'PCR machines, centrifuges, microscopes and bioreactors for research'],
  ['🌐', 'Networking Lab', 'Cisco routers, switches, firewalls and cloud computing infrastructure'],
  ['🤖', 'Robotics Lab', 'Arduino, Raspberry Pi kits, robotic arms and IoT project boards'],
  ['🧪', 'Chemistry Lab', 'Fully equipped chemistry and physics lab for first-year engineering students'],
];

const blocks = [
  { img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&q=80', icon: '📚', title: 'Central Library', tags: ['50,000+ Books', 'Digital Library', '24/7 Access', 'IEEE Xplore', 'NPTEL'], desc1: 'Our Central Library spans over 10,000 sq. ft. housing more than 50,000 books, journals, and digital resources. It is open 24/7 for students and faculty with a dedicated digital zone, reading halls, and group discussion rooms.', desc2: 'Access to NPTEL, IEEE Xplore, Elsevier, and other premier digital libraries is available across campus via Wi-Fi.', reverse: false },
  { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=700&q=80', icon: '🏠', title: 'Hostel', tags: ['Boys Hostel', 'Girls Hostel', 'Wi-Fi', '24/7 Security', 'Mess', 'Medical'], desc1: 'We provide separate, well-maintained hostels for boys and girls with a combined capacity of 2,000 students. Each room is spacious, ventilated and furnished with beds, wardrobes, study tables and chairs.', desc2: 'Amenities include 24/7 security, Wi-Fi, laundry, mess, indoor games room, TV room and medical facility within campus.', reverse: true },
  { img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&q=80', icon: '🚌', title: 'Transport', tags: ['40+ Buses', 'GPS Tracked', 'Chennai Routes', 'Kanchipuram', 'Safe Travel'], desc1: 'BEC operates a fleet of 40+ college buses covering all major areas of Chennai, Kanchipuram, and surrounding districts. All buses are GPS-tracked with trained drivers and attendants for student safety.', desc2: 'Real-time bus tracking is available through the student portal. Route details and timing schedules are updated each semester.', reverse: false },
  { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80', icon: '🏆', title: 'Sports Complex', tags: ['Cricket', 'Football', 'Basketball', 'Badminton', 'Athletics', 'NSS', 'NCC'], desc1: 'Our sprawling sports complex covers cricket grounds, football fields, basketball courts, badminton courts, volleyball courts, and an indoor games hall. Students are encouraged to participate in inter-college tournaments.', desc2: 'BEC has produced state-level players in cricket, athletics and chess. We also have NSS and NCC units for social service and discipline.', reverse: true },
];

function FacilitiesPage() {
  return (
    <>
      <Navbar />

      <div style={{ background: '#fff', margin: '0 20px 20px', borderRadius: '35px', padding: '60px 50px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #ebebeb' }}>
        <span className="section-tag">Campus Life</span>
        <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#1a1a1a', margin: '12px 0 14px' }}>World-Class Facilities</h2>
        <p style={{ fontSize: '15px', fontWeight: '300', color: '#666', maxWidth: '600px', margin: '0 auto' }}>Best Engineering College provides state-of-the-art infrastructure to support academic excellence, research, and student well-being.</p>
      </div>

      {blocks.map(b => (
        <div key={b.title} style={{ background: '#fff', margin: '0 20px 20px', borderRadius: '35px', padding: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #ebebeb', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', flexDirection: b.reverse ? 'row-reverse' : 'row' }}>
          <div style={{ flex: '1', minWidth: '260px' }}>
            <img src={b.img} alt={b.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '22px', display: 'block', boxShadow: '0 6px 24px rgba(0,0,0,0.1)' }} />
          </div>
          <div style={{ flex: '2', minWidth: '260px' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>{b.icon}</div>
            <h3 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px' }}>{b.title}</h3>
            <p style={{ fontSize: '13.5px', color: '#666', lineHeight: '1.85', marginBottom: '14px', fontWeight: '300' }}>{b.desc1}</p>
            <p style={{ fontSize: '13.5px', color: '#666', lineHeight: '1.85', marginBottom: '14px', fontWeight: '300' }}>{b.desc2}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
              {b.tags.map(t => <span key={t} style={{ background: '#f5f5f5', color: '#333', fontSize: '11px', fontWeight: '600', padding: '5px 14px', borderRadius: '35px', border: '1px solid #ddd' }}>{t}</span>)}
            </div>
          </div>
        </div>
      ))}

      <div style={{ background: '#fff', margin: '0 20px 20px', borderRadius: '35px', padding: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #ebebeb' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="section-tag center">Research & Practice</span>
          <h2 className="sec-title">Laboratories</h2>
          <p className="sec-sub">Advanced, well-equipped labs for hands-on learning and research</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
          {labs.map(([icon, title, desc]) => (
            <div key={title} style={{ flex: '1', minWidth: '220px', background: '#fff', border: '1px solid #eee', borderRadius: '22px', padding: '24px 20px', textAlign: 'center', boxShadow: '0 3px 14px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{icon}</div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>{title}</h4>
              <p style={{ fontSize: '12px', color: '#888', lineHeight: '1.6', fontWeight: '300' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default FacilitiesPage;
