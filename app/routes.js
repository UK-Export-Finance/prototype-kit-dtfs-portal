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
    // If view doesn't exist, redirect to dashboard for that version
    res.redirect(`/${version}/dashboard-deals`)
  }
})
