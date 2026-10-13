import { ReguScanUser, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

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

    // Check Supabase profiles table if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', clean)
          .maybeSingle();

        if (dbUser) {
          const user: ReguScanUser = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as UserRole,
            organizationName: dbUser.organization_name,
            rcNumber: dbUser.rc_number || undefined,
            designation: dbUser.designation || undefined,
            directorate: dbUser.directorate || undefined
          };
          authService.setCurrentUser(user);
          return { success: true, user };
        }
      } catch (err) {
        console.warn('Supabase profiles query fallback:', err);
      }
    }

    // Check custom registered users from local cache
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

    // Save to local cache
    const existing = authService.getRegisteredUsers();
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...existing, newUser]));
    authService.setCurrentUser(newUser);

    // Sync to Supabase profiles table if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').upsert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          organization_name: newUser.organizationName,
          rc_number: newUser.rcNumber,
          designation: newUser.designation
        });
      } catch (err) {
        console.warn('Supabase profile registration sync note:', err);
      }
    }

    return { success: true, user: newUser };
  },

  resetPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      return { success: false, message: 'Please provide a valid official email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(clean);
        if (error) {
          console.warn('Supabase password reset warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase resetPassword fallback:', err);
      }
    }

    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${clean}. If this account is registered with NAFDAC or as a licensed manufacturer, follow the link in your inbox to reset your credentials.`
    };
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
