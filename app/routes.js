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
router.get('/:version/Change/change-facility-start', (req, res) => {
  const version = req.params.version
  res.render(`${version}/Change/change-facility-start`, {
    activePage: 'dashboard'
  })
})

router.post('/:version/Change/change-facility-start', (req, res) => {
  const version = req.params.version
  const changeOptions = req.body['change-options']
  
  if (!changeOptions || changeOptions.length === 0) {
    // Show error - no options selected
    res.render(`${version}/Change/change-facility-start`, {
      activePage: 'dashboard',
      errors: {
        'change-options': {
          text: 'Select what you need to change'
        }
      }
    })
  } else {
    // Navigate to next page based on selection
    if (changeOptions.includes('cover-end-date')) {
      res.redirect(`/${version}/Change/change-cover-end-date`)
    } else if (changeOptions.includes('facility-value')) {
      res.redirect(`/${version}/Change/change-facility-value`)
    } else {
      res.redirect(`/${version}/Change/change-cover-end-date`)
    }
  }
})

router.get('/:version/Change/change-cover-end-date', (req, res) => {
  const version = req.params.version
  res.render(`${version}/Change/change-cover-end-date`, {
    activePage: 'dashboard'
  })
})

router.post('/:version/Change/change-cover-end-date', (req, res) => {
  const version = req.params.version
  const day = req.body['new-cover-end-date-day']
  const month = req.body['new-cover-end-date-month']
  const year = req.body['new-cover-end-date-year']
  
  if (!day || !month || !year) {
    res.render(`${version}/Change/change-cover-end-date`, {
      activePage: 'dashboard',
      errors: {
        'new-cover-end-date': {
          text: 'Enter a valid date'
        }
      }
    })
  } else {
    res.redirect(`/${version}/Change/change-facility-value`)
  }
})

router.get('/:version/Change/change-facility-value', (req, res) => {
  const version = req.params.version
  res.render(`${version}/Change/change-facility-value`, {
    activePage: 'dashboard'
  })
})

router.post('/:version/Change/change-facility-value', (req, res) => {
  const version = req.params.version
  const facilityValue = req.body['new-facility-value']
  
  if (!facilityValue || facilityValue.trim() === '') {
    res.render(`${version}/Change/change-facility-value`, {
      activePage: 'dashboard',
      errors: {
        'new-facility-value': {
          text: 'Enter the new facility value'
        }
      }
    })
  } else {
    res.redirect(`/${version}/Change/change-facility-end-date`)
  }
})

router.get('/:version/Change/change-facility-end-date', (req, res) => {
  const version = req.params.version
  res.render(`${version}/Change/change-facility-end-date`, {
    activePage: 'dashboard'
  })
})

router.post('/:version/Change/change-facility-end-date', (req, res) => {
  const version = req.params.version
  const facilityEndDate = req.body['facility-end-date']
  
  if (!facilityEndDate) {
    res.render(`${version}/Change/change-facility-end-date`, {
      activePage: 'dashboard',
      errors: {
        'facility-end-date': {
          text: 'Select whether you have a facility end date'
        }
      }
    })
  } else {
    res.redirect(`/${version}/Change/change-eligibility-criteria`)
  }
})

router.get('/:version/Change/change-eligibility-criteria', (req, res) => {
  const version = req.params.version
  res.render(`${version}/Change/change-eligibility-criteria`, {
    activePage: 'dashboard'
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
    res.render(`${version}/Change/change-eligibility-criteria`, {
      activePage: 'dashboard',
      errors: {
        'eligibility-criteria': {
          text: 'Please confirm all eligibility criteria'
        }
      }
    })
  } else {
    res.redirect(`/${version}/Change/change-amendment-date`)
  }
})

router.get('/:version/Change/change-amendment-date', (req, res) => {
  const version = req.params.version
  res.render(`${version}/Change/change-amendment-date`, {
    activePage: 'dashboard'
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
      errors: {
        'amendment-effective-date': {
          text: 'Enter a valid amendment effective date'
        }
      }
    })
  } else {
    res.redirect(`/${version}/Change/change-check-answers`)
  }
})

router.get('/:version/Change/change-check-answers', (req, res) => {
  const version = req.params.version
  res.render(`${version}/Change/change-check-answers`, {
    activePage: 'dashboard'
  })
})

router.post('/:version/Change/change-check-answers', (req, res) => {
  const version = req.params.version
  const answersChecked = req.body['answers-checked']
  
  if (answersChecked === 'true') {
    res.redirect(`/${version}/Change/change-confirmation`)
  } else {
    res.render(`${version}/Change/change-check-answers`, {
      activePage: 'dashboard',
      errors: {
        'answers-checked': {
          text: 'Please confirm you have checked your answers'
        }
      }
    })
  }
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
