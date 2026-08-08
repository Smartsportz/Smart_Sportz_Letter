import { PresetSample } from '../types';

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'preset_appointment',
    name: 'Appointment Letter',
    category: 'Employment',
    method: 'from_to_sub_body',
    method1: {
      title: 'APPOINTMENT LETTER',
      refNo: 'REF: SS/2026/APT-014',
      from: 'The Management,\nSMARTSPORTZ.IN,\nBangalore, India',
      to: 'To,\nMr. Rajesh Kumar,\nSenior Sports Operations Manager,\nBangalore',
      subject: 'SUB: Letter of Appointment as Senior Sports Operations Manager',
      body: `We are pleased to offer you the position of Senior Sports Operations Manager at SMARTSPORTZ.IN. Based on your impressive track record in sports event management and community athletics, we are confident that you will make significant contributions to our organization.

Your key duties will include managing inter-school sports tournaments, supervising field coordinators, coordinating venue operations, and promoting our youth athletic development programs across Karnataka.

Please sign and return the attached duplicate copy of this letter as confirmation of your acceptance of this offer and agreement to the employment terms. We look forward to welcoming you to the SMARTSPORTZ.IN family.`
    }
  },
  {
    id: 'preset_sponsorship',
    name: 'Tournament Sponsorship Request',
    category: 'Business Inquiry',
    method: 'from_to_sub_body',
    method1: {
      title: 'SPONSORSHIP INVITATION',
      refNo: 'REF: SS/2026/SPON-88',
      from: 'Sponsorship Committee,\nSMARTSPORTZ.IN,\nBangalore, India',
      to: 'To,\nThe Marketing Director,\nGlobal Youth Apparel Ltd.,\nBangalore',
      subject: 'SUB: Request for Title Sponsorship - National Youth Badminton Championship 2026',
      body: `SMARTSPORTZ.IN is proud to announce the 5th Annual National Youth Badminton Championship scheduled from September 15 to September 18, 2026. This premier event will bring together over 1,200 aspiring young athletes from 80+ sports academies.

We cordially invite Global Youth Apparel Ltd. to join us as the Official Title Sponsor. Partnering with us offers exceptional brand visibility through digital live streams, arena branding, jersey logos, and press coverage across major athletic media outlets.

Enclosed is the comprehensive sponsorship proposal detailing tier benefits and engagement opportunities. We welcome the opportunity to discuss this partnership at your earliest convenience.`
    }
  },
  {
    id: 'preset_announcement',
    name: 'Official Partner Announcement',
    category: 'General Notice',
    method: 'dear_body',
    method2: {
      title: 'OFFICIAL ANNOUNCEMENT',
      refNo: 'REF: SS/2026/NOT-102',
      dear: 'Dear Valued Sports Partner,',
      body: `We are excited to share a major milestone in our journey. SMARTSPORTZ.IN has officially expanded its sports infrastructure platform to cover regional tournaments in football, tennis, chess, and track & field events across South India.

Guided by our core motto — "PLAY · COMPETE · INSPIRE · SUCCEED" — our mission remains centered on empowering young talent with world-class facilities and transparent tournament tracking.

We express our sincere gratitude for your continued support and collaboration. Stay tuned for upcoming event registrations and partnership programs through our portal www.smartsportz.in.`
    }
  },
  {
    id: 'preset_experience',
    name: 'Relieving & Experience Certificate',
    category: 'HR / Personnel',
    method: 'from_to_sub_body',
    method1: {
      title: 'EXPERIENCE & RELIEVING CERTIFICATE',
      refNo: 'REF: SS/HR/2026/EXP-402',
      from: 'Department of Human Resources,\nSMARTSPORTZ.IN,\nBangalore',
      to: 'To Whom It May Concern,',
      subject: 'SUB: Experience Certificate and Relieving Confirmation',
      body: `This is to certify that Ms. Ananya Sharma was employed with SMARTSPORTZ.IN from March 1, 2023 to July 31, 2026, serving as Assistant Tournament Coordinator.

During her tenure with us, Ms. Sharma performed her duties with dedication, professional integrity, and high proficiency. She was instrumental in organizing regional badminton leagues and overseeing athlete registration protocols.

She has been relieved of her duties at her own request effective July 31, 2026. All company dues have been settled in full. We wish her every success in her future career endeavors.`
    }
  },
  {
    id: 'preset_appreciation',
    name: 'Letter of Appreciation',
    category: 'Recognition',
    method: 'dear_body',
    method2: {
      title: 'LETTER OF APPRECIATION',
      refNo: 'REF: SS/2026/APP-09',
      dear: 'Dear Coach Vikram,',
      body: `On behalf of the entire management at SMARTSPORTZ.IN, I am writing to extend our heartfelt appreciation for your outstanding coaching leadership during the recent Inter-College Chess Championship.

Your exemplary discipline, tactical guidance, and encouraging mentorship led our youth squad to secure top honors in the team event. Your commitment to fostering sporting spirit reflects the very essence of our motto.

Thank you once again for your remarkable dedication. We look forward to continuing our successful association in upcoming championship seasons.`
    }
  }
];
