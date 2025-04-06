import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginPage from '../src/pages/LoginPage'

// Remove this if mocking CSS via vite.config.js
// vi.mock('../assets/styles/Authentication.css', () => ({}))

vi.mock('../src/assets/components/Login', () => ({
  default: () => <div>Login Component</div>
}))
vi.mock('../src/assets/components/Register', () => ({
  default: () => <div>Register Component</div>
}))
vi.mock('../src/assets/components/LoginOverlay', () => ({
  default: ({ togglePanel }) => <button onClick={togglePanel}>Toggle Panel</button>
}))
vi.mock('../src/assets/components/Banner', () => ({
  default: () => <div>Banner</div>
}))
vi.mock('../src/store/authStore', () => ({
  useAuthStore: () => ({ set: () => {} })
}))

describe('LoginPage', () => {
  it('renders LoginPage with all components', () => {
    render(<LoginPage />)

    expect(screen.getByText('Banner')).toBeInTheDocument()
    expect(screen.getByText('Login Component')).toBeInTheDocument()
    expect(screen.getByText('Register Component')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Toggle Panel' })).toBeInTheDocument()
  })
})
