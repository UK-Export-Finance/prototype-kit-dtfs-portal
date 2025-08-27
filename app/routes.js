//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// Dynamic version-based routing for dashboard pages
router.get('/:version/dashboard-deals', (req, res) => {
  const version = req.params.version // 'v01', 'v02', etc.
  res.render(`${version}/dashboard-deals`, {
    activePage: 'dashboard'
  })
})

router.get('/:version/dashboard-facilities', (req, res) => {
  const version = req.params.version
  res.render(`${version}/dashboard-facilities`, {
    activePage: 'dashboard'
  })
})

router.get('/:version/dashboard-reports', (req, res) => {
  const version = req.params.version
  res.render(`${version}/dashboard-reports`, {
    activePage: 'reports'
  })
})

router.get('/:version/dashboard-profile', (req, res) => {
  const version = req.params.version
  res.render(`${version}/dashboard-profile`, {
    activePage: 'profile'
  })
})

// Dynamic version-based routing for application details
router.get('/:version/application-details/app-details', (req, res) => {
  const version = req.params.version
  res.render(`${version}/application-details/app-details`, {
    activePage: 'dashboard'
  })
})

// Change folder routing with validation and navigation
router.get('/:version/Change/start', (req, res) => {
  const version = req.params.version
  
  // Get stored change options from session for pre-population
  const changeOptions = req.session.changeOptions || []
  
  res.render(`${version}/Change/start`, {
    activePage: 'dashboard',
    validationErrors: false,
    errors: {},
    changeOptions
  })
})

router.post('/:version/Change/start', (req, res) => {
  const version = req.params.version
  const changeOptions = req.body['change-options']
  
  // Check if no options are selected (either undefined, empty array, single empty string, or _unchecked)
  if (!changeOptions || 
      (Array.isArray(changeOptions) && changeOptions.length === 0) ||
      (typeof changeOptions === 'string' && (changeOptions.trim() === '' || changeOptions === '_unchecked')) ||
      (Array.isArray(changeOptions) && changeOptions.every(option => !option || option.trim() === '' || option === '_unchecked'))) {
    res.render(`${version}/Change/start`, {
      activePage: 'dashboard',
      validationErrors: true,
      errors: {
        'change-options': 'Select if  you need to change the cover end date, facility value or both'
      },
      errorMessages: [
        {
          field: 'change-options',
          message: 'Select if  you need to change the cover end date, facility value or both'
        }
      ]
    })
  } else {
    // Store selections in session
    req.session.changeOptions = changeOptions
    
    // Navigate based on selection logic
    // Always go through cover end date first if selected, or directly to facility end date question if only facility value is selected
    if (changeOptions.includes('cover-end-date')) {
      res.redirect(`/${version}/Change/provide-cover-end-date`)
    } else if (changeOptions.includes('facility-value')) {
      // If only facility value is selected, go directly to facility end date question
      res.redirect(`/${version}/Change/change-facility-end-date`)
    } else {
      // Fallback - should not happen with current checkbox options
      res.redirect(`/${version}/Change/provide-cover-end-date`)
    }
  }
})

router.get('/:version/Change/provide-cover-end-date', (req, res) => {
  const version = req.params.version
  
  // Get stored cover end date from session for pre-population
  const coverEndDate = req.session.coverEndDate || null
  
  res.render(`${version}/Change/provide-cover-end-date`, {
    activePage: 'dashboard',
    validationErrors: false,
    errors: {},
    coverEndDate
  })
})

router.post('/:version/Change/provide-cover-end-date', (req, res) => {
  const version = req.params.version
  const day = req.body['new-cover-end-date-day']
  const month = req.body['new-cover-end-date-month']
  const year = req.body['new-cover-end-date-year']
  
  if (!day || !month || !year) {
    res.render(`${version}/Change/provide-cover-end-date`, {
      activePage: 'dashboard',
      validationErrors: true,
      errors: {
        'new-cover-end-date': 'The new cover end date must be a real date'
      },
      errorMessages: [
        {
          field: 'new-cover-end-date',
          message: 'The new cover end date must be a real date'
        }
      ],
      coverEndDate: { day, month, year }
    })
  } else {
    // Store the date in session
    req.session.coverEndDate = { day, month, year }
    
    // Always navigate to facility end date question first
    // This ensures we capture either bank review date or facility end date before proceeding
    res.redirect(`/${version}/Change/change-facility-end-date`)
  }
})

router.get('/:version/Change/change-facility-value', (req, res) => {
  const version = req.params.version
  
  // Get stored facility value from session for pre-population
  const facilityValue = req.session.facilityValue || null
  
  res.render(`${version}/Change/change-facility-value`, {
    activePage: 'dashboard',
    validationErrors: false,
    errors: {},
    facilityValue
  })
})

router.post('/:version/Change/change-facility-value', (req, res) => {
  const version = req.params.version
  const facilityValue = req.body['new-facility-value']
  
  if (!facilityValue || facilityValue.trim() === '') {
    res.render(`${version}/Change/change-facility-value`, {
      activePage: 'dashboard',
      validationErrors: true,
      errors: {
        'new-facility-value': 'Enter new facility value'
      },
      errorMessages: [
        {
          field: 'new-facility-value',
          message: 'Enter new facility value'
        }
      ]
    })
  } else {
    // Store the facility value in session
    req.session.facilityValue = facilityValue
    
    // Navigate to eligibility criteria (since we've already captured facility end date/bank review date)
    res.redirect(`/${version}/Change/change-eligibility-criteria`)
  }
})

router.get('/:version/Change/change-facility-end-date', (req, res) => {
  const version = req.params.version
  
  // Get stored facility end date selection from session for pre-population
  const hasFacilityEndDate = req.session.hasFacilityEndDate || null
  
  res.render(`${version}/Change/change-facility-end-date`, {
    activePage: 'dashboard',
    validationErrors: false,
    errors: {},
    hasFacilityEndDate
  })
})

router.post('/:version/Change/change-facility-end-date', (req, res) => {
  const version = req.params.version
  const facilityEndDate = req.body['facility-end-date']
  
  if (!facilityEndDate) {
    res.render(`${version}/Change/change-facility-end-date`, {
      activePage: 'dashboard',
      validationErrors: true,
      errors: {
        'facility-end-date': 'Select if there is an end date for this facility'
      },
      errorMessages: [
        {
          field: 'facility-end-date',
          message: 'Select if there is an end date for this facility'
        }
      ]
    })
  } else {
    // Store the selection in session
    req.session.hasFacilityEndDate = facilityEndDate
    
    if (facilityEndDate === 'yes') {
      res.redirect(`/${version}/Change/provide-facility-end-date`)
    } else {
      res.redirect(`/${version}/Change/provide-bank-review-date`)
    }
  }
})

router.get('/:version/Change/provide-facility-end-date', (req, res) => {
  const version = req.params.version
  
  // Get stored facility end date from session for pre-population
  const facilityEndDate = req.session.facilityEndDate || null
  
  res.render(`${version}/Change/provide-facility-end-date`, {
    activePage: 'dashboard',
    validationErrors: false,
    errors: {},
    facilityEndDate
  })
})

router.post('/:version/Change/provide-facility-end-date', (req, res) => {
  const version = req.params.version
  const day = req.body['new-cover-end-date-day']
  const month = req.body['new-cover-end-date-month']
  const year = req.body['new-cover-end-date-year']
  
  if (!day || !month || !year) {
    res.render(`${version}/Change/provide-facility-end-date`, {
      activePage: 'dashboard',
      validationErrors: true,
      errors: {
        'new-cover-end-date': 'Facility end date must be a real date'
      },
      errorMessages: [
        {
          field: 'new-cover-end-date',
          message: 'Facility end date must be a real date'
        }
      ]
    })
  } else {
    // Store the facility end date in session
    req.session.facilityEndDate = { day, month, year }
    
    // Check if facility value was selected on first page
    if (req.session.changeOptions && req.session.changeOptions.includes('facility-value')) {
      res.redirect(`/${version}/Change/change-facility-value`)
    } else {
      res.redirect(`/${version}/Change/change-eligibility-criteria`)
    }
  }
})

router.get('/:version/Change/provide-bank-review-date', (req, res) => {
  const version = req.params.version
  
  // Get stored bank review date from session for pre-population
  const bankReviewDate = req.session.bankReviewDate || null
  
  res.render(`${version}/Change/provide-bank-review-date`, {
    activePage: 'dashboard',
    validationErrors: false,
    errors: {},
    bankReviewDate
  })
})

router.post('/:version/Change/provide-bank-review-date', (req, res) => {
  const version = req.params.version
  const day = req.body['new-cover-end-date-day']
  const month = req.body['new-cover-end-date-month']
  const year = req.body['new-cover-end-date-year']
  
  if (!day || !month || !year) {
    res.render(`${version}/Change/provide-bank-review-date`, {
      activePage: 'dashboard',
      validationErrors: true,
      errors: {
        'new-cover-end-date': 'Bank review date must be a real date'
      },
      errorMessages: [
        {
          field: 'new-cover-end-date',
          message: 'Bank review date must be a real date'
        }
      ]
    })
  } else {
    // Store the bank review date in session
    req.session.bankReviewDate = { day, month, year }
    
    // Check if facility value was selected on first page
    if (req.session.changeOptions && req.session.changeOptions.includes('facility-value')) {
      res.redirect(`/${version}/Change/change-facility-value`)
    } else {
      res.redirect(`/${version}/Change/change-eligibility-criteria`)
    }
  }
})

router.get('/:version/Change/change-eligibility-criteria', (req, res) => {
  const version = req.params.version
  
  // Get stored eligibility criteria from session for pre-population
  const eligibilityCriteria = req.session.eligibilityCriteria || {}
  
  res.render(`${version}/Change/change-eligibility-criteria`, {
    activePage: 'dashboard',
    validationErrors: false,
    errors: {},
    eligibilityCriteria
  })
})

router.post('/:version/Change/change-eligibility-criteria', (req, res) => {
  const version = req.params.version
  const eligibility1 = req.body['eligibility-1']
  const eligibility2 = req.body['eligibility-2']
  const eligibility3 = req.body['eligibility-3']
  const eligibility4 = req.body['eligibility-4']
  const eligibility5 = req.body['eligibility-5']
  const eligibility6 = req.body['eligibility-6']
  const eligibility7 = req.body['eligibility-7']
  
  if (!eligibility1 || !eligibility2 || !eligibility3 || !eligibility4 || !eligibility5 || !eligibility6 || !eligibility7) {
    // Store the submitted values in session for pre-population on validation errors
    req.session.eligibilityCriteria = {
      eligibility1, eligibility2, eligibility3, eligibility4, 
      eligibility5, eligibility6, eligibility7
    }
    
    res.render(`${version}/Change/change-eligibility-criteria`, {
      activePage: 'dashboard',
      validationErrors: true,
      errors: {
        'eligibility-1': !eligibility1 ? '1. Select if the Facility is not an Affected Facility' : '',
        'eligibility-2': !eligibility2 ? '2. Select if Neither the Exporter, nor its UK Parent Obligor is an Affected Person' : '',
        'eligibility-3': !eligibility3 ? '3. Select if the Cover Period of the Facility is within the Facility Maximum Cover Period' : '',
        'eligibility-4': !eligibility4 ? '4. Select if the Covered Facility Limit (converted for this purpose into the Master Guarantee Base Currency) of the Facility is not more than the lesser of (i) the Available Master Guarantee Limit; and the Available Obligor(s) Limit' : '',
        'eligibility-5': !eligibility5 ? '5. Select if the Bank has completed its Bank Due Diligence to its satisfaction in accordance with its policies and procedures without having to escalate any issue raised during its Bank Due Diligence internally to any Relevant Person for approval as part of its usual Bank Due Diligence' : '',
        'eligibility-6': !eligibility6 ? '6. Select if the Bank is the sole and legal beneficial owner of, and has good title to, the Facility and any Utilisation thereunder' : '',
        'eligibility-7': !eligibility7 ? '7. Select if the Bank\'s right, title and interest in and to the Facility and any Utilisation thereunder (including any indebtedness, obligation of liability of each Obligor) is free and clear of any Security or Quasi-Security (other than Permitted Security)' : ''
      },
      errorMessages: [
        !eligibility1 && { field: 'eligibility-1', message: '1. Select if the Facility is not an Affected Facility' },
        !eligibility2 && { field: 'eligibility-2', message: '2. Select if Neither the Exporter, nor its UK Parent Obligor is an Affected Person' },
        !eligibility3 && { field: 'eligibility-3', message: '3. Select if the Cover Period of the Facility is within the Facility Maximum Cover Period' },
        !eligibility4 && { field: 'eligibility-4', message: '4. Select if the Covered Facility Limit (converted for this purpose into the Master Guarantee Base Currency) of the Facility is not more than the lesser of (i) the Available Master Guarantee Limit; and the Available Obligor(s) Limit' },
        !eligibility5 && { field: 'eligibility-5', message: '5. Select if the Bank has completed its Bank Due Diligence to its satisfaction in accordance with its policies and procedures without having to escalate any issue raised during its Bank Due Diligence internally to any Relevant Person for approval as part of its usual Bank Due Diligence' },
        !eligibility6 && { field: 'eligibility-6', message: '6. Select if the Bank is the sole and legal beneficial owner of, and has good title to, the Facility and any Utilisation thereunder' },
        !eligibility7 && { field: 'eligibility-7', message: '7. Select if the Bank\'s right, title and interest in and to the Facility and any Utilisation thereunder (including any indebtedness, obligation of liability of each Obligor) is free and clear of any Security or Quasi-Security (other than Permitted Security)' }
      ].filter(Boolean),
      eligibilityCriteria: req.session.eligibilityCriteria
    })
  } else {
    // Store eligibility criteria in session
    req.session.eligibilityCriteria = {
      eligibility1, eligibility2, eligibility3, eligibility4, 
      eligibility5, eligibility6, eligibility7
    }
    
    res.redirect(`/${version}/Change/change-amendment-date`)
  }
})

router.get('/:version/Change/change-amendment-date', (req, res) => {
  const version = req.params.version
  
  // Get stored amendment date from session for pre-population
  const amendmentDate = req.session.amendmentDate || null
  
  res.render(`${version}/Change/change-amendment-date`, {
    activePage: 'dashboard',
    validationErrors: false,
    errors: {},
    amendmentDate
  })
})

router.post('/:version/Change/change-amendment-date', (req, res) => {
  const version = req.params.version
  const day = req.body['amendment-effective-date-day']
  const month = req.body['amendment-effective-date-month']
  const year = req.body['amendment-effective-date-year']
  
  if (!day || !month || !year) {
    res.render(`${version}/Change/change-amendment-date`, {
      activePage: 'dashboard',
      validationErrors: true,
      errors: {
        'amendment-effective-date': 'Date amendment effective from must be provided'
      },
      errorMessages: [
        {
          field: 'amendment-effective-date',
          message: 'Date amendment effective from must be provided'
        }
      ]
    })
  } else {
    // Store the amendment date in session
    req.session.amendmentDate = { day, month, year }
    
    res.redirect(`/${version}/Change/change-check-answers`)
  }
})

router.get('/:version/Change/change-check-answers', (req, res) => {
  const version = req.params.version
  
  // Get all stored values from session
  const changeOptions = req.session.changeOptions || []
  const coverEndDate = req.session.coverEndDate
  const facilityValue = req.session.facilityValue
  const hasFacilityEndDate = req.session.hasFacilityEndDate
  const facilityEndDate = req.session.facilityEndDate
  const bankReviewDate = req.session.bankReviewDate
  const eligibilityCriteria = req.session.eligibilityCriteria
  const amendmentDate = req.session.amendmentDate
  
  res.render(`${version}/Change/change-check-answers`, {
    activePage: 'dashboard',
    changeOptions,
    coverEndDate,
    facilityValue,
    hasFacilityEndDate,
    facilityEndDate,
    bankReviewDate,
    eligibilityCriteria,
    amendmentDate
  })
})

router.post('/:version/Change/change-check-answers', (req, res) => {
  const version = req.params.version
  
  // Redirect directly to confirmation page without validation
  res.redirect(`/${version}/Change/change-confirmation`)
})

router.get('/:version/Change/change-confirmation', (req, res) => {
  const version = req.params.version
  res.render(`${version}/Change/change-confirmation`, {
    activePage: 'dashboard'
  })
})

// Root route redirects to v01 dashboard (default version)
router.get('/', (req, res) => {
  res.redirect('/v01/dashboard-deals')
})

// Catch-all route for any version folder
router.get('/:version/*', (req, res) => {
  const version = req.params.version
  const path = req.params[0]
  
  // Try to render the view if it exists
  try {
    res.render(`${version}/${path}`, {
      activePage: 'dashboard' // Default to dashboard
    })
  } catch (error) {
    // If view doesn't exist, redirect to dashboard
    res.redirect(`/${version}/dashboard-deals`)
  }
})
