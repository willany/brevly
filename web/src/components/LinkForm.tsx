import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useCreateLink } from '../hooks/useCreateLink';
import { createLinkSchema } from '../utils/validation';
import type { CreateLinkFormData } from '../utils/validation';

import { Button } from './Button';
import { Input } from './Input';
import styles from './LinkForm.module.css';
import { PrefixInput } from './PrefixInput';

export const LinkForm: React.FC = () => {
  const createLinkMutation = useCreateLink();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
  });

  const handleOriginalUrlBlur = () => {
    if (errors.originalUrl) {
      clearErrors('originalUrl');
    }
  };

  const handleCustomShortUrlBlur = () => {
    if (errors.customShortUrl) {
      clearErrors('customShortUrl');
    }
  };

  const onSubmit = async (data: CreateLinkFormData) => {
    try {
      await createLinkMutation.mutateAsync(data);
      reset();
    } catch (error: any) {
      console.log('Error details:', error);

      if (error.response) {
        if (error.response.status === 409) {
          setError('customShortUrl', {
            type: 'manual',
            message: 'Esta URL personalizada já está em uso',
          });
        } else if (error.response.data?.error) {
          setError('root', {
            type: 'manual',
            message: error.response.data.error,
          });
        } else {
          setError('root', {
            type: 'manual',
            message: error.message || 'Falha ao criar link',
          });
        }
      } else {
        setError('root', {
          type: 'manual',
          message: error.message || 'Falha ao criar link',
        });
      }
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Novo link</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label='LINK ORIGINAL'
          placeholder='www.exemplo.com.br'
          error={errors.originalUrl?.message}
          {...register('originalUrl', {
            onBlur: handleOriginalUrlBlur,
          })}
        />

        <PrefixInput
          label='LINK ENCURTADO'
          prefix='brev.ly/'
          error={errors.customShortUrl?.message}
          {...register('customShortUrl', {
            onBlur: handleCustomShortUrlBlur,
          })}
        />

        {errors.root && (
          <div className={styles.errorMessage}>{errors.root.message}</div>
        )}

        <Button
          type='submit'
          loading={isSubmitting}
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar link'}
        </Button>
      </form>
    </div>
  );
};
