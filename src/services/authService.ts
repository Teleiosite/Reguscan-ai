import { ReguScanUser, UserRole } from '../types';

const STORAGE_KEY = 'reguscan_active_session';
const REGISTERED_USERS_KEY = 'reguscan_registered_users';

export const DEMO_PROFILES: ReguScanUser[] = [
  {
    id: 'usr-nafdac-01',
    name: 'Pharm. Chinyere Nwosu',
    email: 'chinyere.nwosu@nafdac.gov.ng',
    role: 'NAFDAC_OFFICER',
    organizationName: 'National Agency for Food & Drug Administration and Control (NAFDAC)',
    designation: 'Chief Regulatory Officer (Drug R&R Directorate)',
    directorate: 'DRUG_RR'
  },
  {
    id: 'usr-nafdac-02',
    name: 'Mr. Babatunde Sanusi',
    email: 'babatunde.sanusi@nafdac.gov.ng',
    role: 'NAFDAC_OFFICER',
    organizationName: 'National Agency for Food & Drug Administration and Control (NAFDAC)',
    designation: 'Chief Food Safety Inspection Officer',
    directorate: 'FOOD_RR'
  },
  {
    id: 'usr-app-01',
    name: 'Dr. Olumide Johnson (Superintendent Pharmacist)',
    email: 'regulatory@fidson.com',
    role: 'APPLICANT_COMPANY',
    organizationName: 'Fidson Healthcare PLC',
    rcNumber: 'RC-104928',
    designation: 'Head of Regulatory Affairs & Compliance',
    directorate: 'DRUG_RR'
  },
  {
    id: 'usr-app-02',
    name: 'Hajia Amina Bello',
    email: 'compliance@flourmillsng.com',
    role: 'APPLICANT_COMPANY',
    organizationName: 'Flour Mills of Nigeria PLC',
    rcNumber: 'RC-023910',
    designation: 'Quality Assurance & Regulatory Director',
    directorate: 'FOOD_RR'
  },
  {
    id: 'usr-app-03',
    name: 'Pharm. Emeka Okoye',
    email: 'regulatory@apexpharma.ng',
    role: 'APPLICANT_COMPANY',
    organizationName: 'Apex Pharmaceuticals Limited',
    rcNumber: 'RC-384910',
    designation: 'Regulatory Affairs Manager',
    directorate: 'DRUG_RR'
  }
];

export const authService = {
  detectRoleFromEmail: (email: string): UserRole => {
    const clean = email.trim().toLowerCase();
    if (clean.endsWith('@nafdac.gov.ng') || clean.startsWith('naf') || clean.includes('nafdac')) {
      return 'NAFDAC_OFFICER';
    }
    return 'APPLICANT_COMPANY';
  },

  getCurrentUser: (): ReguScanUser | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse active user session');
    }
    return null;
  },

  setCurrentUser: (user: ReguScanUser | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  login: async (email: string): Promise<{ success: boolean; user: ReguScanUser }> => {
    const clean = email.trim().toLowerCase();
    
    // Check demo profiles
    const matched = DEMO_PROFILES.find(p => p.email.toLowerCase() === clean);
    if (matched) {
      authService.setCurrentUser(matched);
      return { success: true, user: matched };
    }

    // Check custom registered users
    const registered = authService.getRegisteredUsers();
    const matchedCustom = registered.find(u => u.email.toLowerCase() === clean);
    if (matchedCustom) {
      authService.setCurrentUser(matchedCustom);
      return { success: true, user: matchedCustom };
    }

    // Dynamic fallback based on email domain
    const role = authService.detectRoleFromEmail(clean);
    const domainPart = clean.split('@')[1] || 'Company';
    const orgName = role === 'NAFDAC_OFFICER'
      ? 'NAFDAC Regulatory Affairs Directorate'
      : `${domainPart.split('.')[0].toUpperCase()} Nigeria Limited`;

    const generatedUser: ReguScanUser = {
      id: `usr-${Date.now()}`,
      name: clean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: clean,
      role,
      organizationName: orgName,
      rcNumber: role === 'APPLICANT_COMPANY' ? `RC-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      designation: role === 'NAFDAC_OFFICER' ? 'Regulatory Vetting Officer' : 'Authorized Representative'
    };

    authService.setCurrentUser(generatedUser);
    return { success: true, user: generatedUser };
  },

  registerCompany: async (
    companyName: string,
    rcNumber: string,
    superintendentName: string,
    email: string
  ): Promise<{ success: boolean; user: ReguScanUser }> => {
    const newUser: ReguScanUser = {
      id: `usr-reg-${Date.now()}`,
      name: superintendentName,
      email: email.trim().toLowerCase(),
      role: 'APPLICANT_COMPANY',
      organizationName: companyName,
      rcNumber: rcNumber.toUpperCase().startsWith('RC-') ? rcNumber.toUpperCase() : `RC-${rcNumber.toUpperCase()}`,
      designation: 'Superintendent Pharmacist / Regulatory Officer'
    };

    const existing = authService.getRegisteredUsers();
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...existing, newUser]));
    authService.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  getRegisteredUsers: (): ReguScanUser[] => {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
