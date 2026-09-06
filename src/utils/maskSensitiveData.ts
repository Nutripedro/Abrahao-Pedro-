/**
 * Utilitários de Anonimização e Ofuscação de Dados Sensíveis
 * Em conformidade com a LGPD (Lei 13.709/2018, Art. 5º e Art. 13)
 * para exibição segura em Modo de Treinamento, apresentações e gravações.
 */

/**
 * Ofusca um CPF no padrão: ***.***.123-45
 */
export function maskCpf(cpf: string, shouldMask: boolean = true): string {
  if (!shouldMask) return cpf;
  if (!cpf) return '***.***.***-**';
  
  const clean = cpf.replace(/\D/g, '');
  if (clean.length === 11) {
    return `***.***.${clean.slice(6, 9)}-${clean.slice(9, 11)}`;
  }
  return '***.***.892-04';
}

/**
 * Ofusca um número de telefone no padrão: (11) 98***-**21
 */
export function maskPhone(phone: string, shouldMask: boolean = true): string {
  if (!shouldMask) return phone;
  if (!phone) return '(11) 9****-****';
  
  const clean = phone.replace(/\D/g, '');
  if (clean.length >= 10) {
    const ddd = clean.slice(0, 2);
    const start = clean.slice(2, 4);
    const end = clean.slice(-2);
    return `(${ddd}) ${start}***-**${end}`;
  }
  return '(11) 98***-**42';
}

/**
 * Ofusca um endereço de e-mail no padrão: m***s@email.com ou paciente.sintetico@demo.com
 */
export function maskEmail(email: string, shouldMask: boolean = true): string {
  if (!shouldMask) return email;
  if (!email || !email.includes('@')) return 'paciente.sintetico@demo.clinica.com';
  
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `${user.charAt(0)}***@${domain}`;
  }
  return `${user.charAt(0)}***${user.charAt(user.length - 1)}@${domain}`;
}

/**
 * Ofusca o nome completo preservando as iniciais para fins didáticos:
 * Mariana Lima Santos -> Mariana L. S. (🧪 Sintético)
 */
export function maskName(fullName: string, shouldMask: boolean = true): string {
  if (!shouldMask) return fullName;
  if (!fullName) return 'Paciente Sintético (Treinamento)';
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return `${parts[0]} (🧪 Demo)`;
  
  const firstName = parts[0];
  const initials = parts.slice(1).map(p => `${p.charAt(0).toUpperCase()}.`).join(' ');
  return `${firstName} ${initials} (🧪 Sintético)`;
}

/**
 * Ofusca prontuário ou identificador de documento
 */
export function maskDocumentId(id: string, shouldMask: boolean = true): string {
  if (!shouldMask) return id;
  return `PRONT-DEMO-${id.replace(/\D/g, '').slice(0, 4) || '7821'}`;
}

/**
 * Retorna tag de identificação visual para registros didáticos
 */
export const SYNTHETIC_BADGE_LABEL = '🧪 Paciente Sintético (LGPD Safe)';
