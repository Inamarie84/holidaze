import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home page', () => {
  it('shows the main CTAs', () => {
    render(<Home />)
    expect(
      screen.getByRole('link', { name: /deploy now/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /read our docs/i })
    ).toBeInTheDocument()
  })

  it('mentions the starter edit hint', () => {
    render(<Home />)
    expect(screen.getByText(/src\/app\/page\.tsx/i)).toBeInTheDocument()
  })
})
