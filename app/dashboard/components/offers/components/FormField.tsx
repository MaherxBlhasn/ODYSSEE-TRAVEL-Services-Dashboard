interface FormFieldProps {
  label: string
  required?: boolean
  error?: string[]
  children: React.ReactNode
}

export const FormField = ({ label, required = false, error, children }: FormFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && error.length > 0 && (
        <div className="mt-2 space-y-1">
          {error.map((err, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">•</span>
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
