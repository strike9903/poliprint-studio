"use client"

import Link from 'next/link'
import { useParams } from 'next/navigation'

interface LocaleLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const params = useParams()
  const locale = params.locale as string || 'uk'
  
  // Формируем правильный путь с локалью
  const localizedHref = href.startsWith('/') ? `/${locale}${href}` : href
  
  return <Link href={localizedHref} {...props}>{children}</Link>
}
