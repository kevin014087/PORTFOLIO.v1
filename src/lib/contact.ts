import { supabase } from './supabase';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Une erreur est survenue lors de l\'envoi du message.';
}

export async function onSubmit(
  data: ContactFormData,
): Promise<{ success: boolean; error?: string }> {
  let sent = false;
  const failures: string[] = [];

  // 1. Intégration Supabase si configuré (sauvegarde en base de données)
  if (supabase) {
    try {
      const { error } = await supabase.from('messages').insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        failures.push(`Supabase : ${error.message}`);
      } else {
        sent = true;
      }
    } catch (err) {
      failures.push(`Supabase : ${getErrorMessage(err)}`);
    }
  }

  // 2. Option Web3Forms (réception e-mail directe)
  const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (web3Key) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3Key,
          name: data.name,
          email: data.email,
          message: data.message,
          subject: `Nouveau message Portfolio de ${data.name}`,
        }),
      });
      const result = await response.json();
      if (result.success) {
        sent = true;
      } else {
        failures.push(result.message || 'Web3Forms : réponse invalide');
      }
    } catch (err) {
      failures.push(`Web3Forms : ${getErrorMessage(err)}`);
    }
  }

  if (sent) {
    return { success: true };
  }

  if (!supabase && !web3Key) {
    return {
      success: false,
      error: "Le formulaire n'est pas encore connecté à un service d'envoi (Supabase ou Web3Forms). Veuillez me contacter directement par email ou WhatsApp.",
    };
  }

  return {
    success: false,
    error: `Échec de l'envoi : ${failures.join(' ; ') || 'erreur inconnue'}. Veuillez réessayer ou me contacter directement.`,
  };
}
