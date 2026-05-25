import Icon from './Icon'

function LoginModal({
  isOpen,
  onClose,
  authView,
  loginStep,
  phoneNumber,
  otpDigits,
  loginError,
  loginMessage,
  accountForm,
  accountProfile,
  onPhoneChange,
  onPhoneSubmit,
  onVerifyOtp,
  onOtpChange,
  onOtpKeyDown,
  onResendOtp,
  onSwitchToLogin,
  onSwitchToSignup,
  onAccountFormChange,
  onCreateAccount,
  onLogout,
  formatAccountPhone,
  otpInputRefs,
}) {
  if (!isOpen) {
    return null
  }

  const isProfileView = authView === 'profile'
  const isSignupView = authView === 'signup'
  const isOtpStep = authView === 'login' && loginStep === 'otp'
  const profileInitials = accountProfile?.fullName
    ? accountProfile.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'AR'

  const profileDetails = [
    {
      label: 'Full Name',
      value: accountProfile?.fullName || 'Aryass Member',
    },
    {
      label: 'Email',
      value: accountProfile?.email || 'Not added yet',
    },
    {
      label: 'Phone',
      value: formatAccountPhone(accountProfile?.phone),
    },
    {
      label: 'City',
      value: accountProfile?.city || 'Not shared yet',
    },
    {
      label: 'Member Since',
      value: accountProfile?.memberSince || 'May 2026',
    },
    {
      label: 'Status',
      value: accountProfile?.tier || 'Private Client',
    },
  ]

  return (
    <div className="login-modal-backdrop" onClick={onClose} aria-hidden={!isOpen}>
      <div
        className={`login-modal-shell ${isProfileView ? 'login-modal-shell--profile' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={isProfileView ? 'Account profile' : 'Login and account access'}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="login-close-button" aria-label="Close account panel" onClick={onClose}>
          <Icon name="close" />
        </button>

        <div className={`login-modal-card ${isProfileView ? 'login-modal-card--profile' : ''}`}>
          <div className="login-modal-brand">
            <span className="brand-word">ARYASS</span>
            <span className="brand-tagline">FEEL BEFORE THE MOMENT</span>
          </div>

          {isProfileView ? (
            <div className="account-panel">
              <div className="account-summary">
                <span className="account-avatar">{profileInitials}</span>
                <div className="account-summary-copy">
                  <p className="login-step-kicker">Your profile</p>
                  <h2>{accountProfile?.fullName || 'Aryass Member'}</h2>
                  <p>{accountProfile?.email || 'Luxury edits, saved to your profile.'}</p>
                  <span className="account-pill">{accountProfile?.tier || 'Private Client'}</span>
                </div>
              </div>

              <div className="account-detail-grid">
                {profileDetails.map((detail) => (
                  <div key={detail.label} className="account-detail-card">
                    <span>{detail.label}</span>
                    <strong>{detail.value}</strong>
                  </div>
                ))}
              </div>

              <div className="account-panel-actions">
                <button type="button" className="login-submit-button login-submit-button--ghost" onClick={onClose}>
                  Continue Shopping
                </button>
                <button type="button" className="login-submit-button" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="login-modal-head">
                <p className="login-step-kicker">
                  {isSignupView ? 'New account' : isOtpStep ? 'OTP verification' : 'Welcome back'}
                </p>
                <h2>
                  {isSignupView
                    ? 'Create your Aryass profile'
                    : isOtpStep
                      ? 'Enter the OTP'
                      : 'Login to continue'}
                </h2>
                <p>
                  {isSignupView
                    ? 'Save your details once and make future shopping feel effortless.'
                    : isOtpStep
                      ? 'Verify your number to open your account securely.'
                      : 'Use OTP login or switch to create account if you are new here.'}
                </p>
              </div>

              {!isOtpStep ? (
                <div className="login-mode-switch" role="tablist" aria-label="Account access">
                  <button
                    type="button"
                    className={!isSignupView ? 'is-active' : ''}
                    aria-selected={!isSignupView}
                    onClick={onSwitchToLogin}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={isSignupView ? 'is-active' : ''}
                    aria-selected={isSignupView}
                    onClick={onSwitchToSignup}
                  >
                    Create Account
                  </button>
                </div>
              ) : null}

              {isSignupView ? (
                <form className="login-form" onSubmit={onCreateAccount}>
                  <div className="login-grid-form">
                    <label className="login-field">
                      <span>Full Name</span>
                      <input
                        type="text"
                        value={accountForm.fullName}
                        onChange={(event) => onAccountFormChange('fullName', event.target.value)}
                        placeholder="Aarohi Sharma"
                        aria-label="Full name"
                      />
                    </label>

                    <label className="login-field">
                      <span>Email Address</span>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(event) => onAccountFormChange('email', event.target.value)}
                        placeholder="you@example.com"
                        aria-label="Email address"
                      />
                    </label>

                    <label className="login-field">
                      <span>Mobile Number</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={accountForm.phone}
                        onChange={(event) => onAccountFormChange('phone', event.target.value)}
                        placeholder="10 digit number"
                        aria-label="Mobile number for account"
                      />
                    </label>

                    <label className="login-field">
                      <span>City</span>
                      <input
                        type="text"
                        value={accountForm.city}
                        onChange={(event) => onAccountFormChange('city', event.target.value)}
                        placeholder="Jaipur"
                        aria-label="City"
                      />
                    </label>
                  </div>

                  <p className="login-helper-text">
                    Your details stay ready for profile view, order support, and a smoother checkout flow.
                  </p>

                  {loginError ? <p className="login-error">{loginError}</p> : null}

                  <button type="submit" className="login-submit-button">
                    Create Account
                  </button>

                  <div className="login-form-footer">
                    <span>Already have an account?</span>
                    <button type="button" className="login-text-button" onClick={onSwitchToLogin}>
                      Login instead
                    </button>
                  </div>
                </form>
              ) : isOtpStep ? (
                <form className="login-form" onSubmit={onVerifyOtp}>
                  <div className="otp-input-row">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={`otp-${index}`}
                        ref={(element) => {
                          otpInputRefs.current[index] = element
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(event) => onOtpChange(index, event.target.value)}
                        onKeyDown={(event) => onOtpKeyDown(event, index)}
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>

                  <p className="login-helper-text">{loginMessage}</p>

                  <button type="button" className="otp-resend-button" onClick={onResendOtp}>
                    Resend OTP
                  </button>

                  {loginError ? <p className="login-error">{loginError}</p> : null}

                  <button type="submit" className="login-submit-button">
                    Verify and Continue
                  </button>
                </form>
              ) : (
                <form className="login-form" onSubmit={onPhoneSubmit}>
                  <p className="login-step-kicker">Enter your mobile number</p>
                  <div className="phone-field">
                    <span className="phone-prefix">
                      <span className="country-flag" />
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(event) => onPhoneChange(event.target.value)}
                      placeholder="Enter 10 digit number"
                      aria-label="Mobile number"
                    />
                  </div>

                  <p className="login-helper-text">{loginMessage}</p>

                  {loginError ? <p className="login-error">{loginError}</p> : null}

                  <button type="submit" className="login-submit-button">
                    Send OTP
                  </button>

                  <div className="login-form-footer">
                    <span>New here?</span>
                    <button type="button" className="login-text-button" onClick={onSwitchToSignup}>
                      Create account
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginModal
