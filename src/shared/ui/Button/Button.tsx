import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: 'primary' | 'secondary'
}

export default function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return <button className={`button button--${variant} ${className}`} {...props}>{children}</button>
}
