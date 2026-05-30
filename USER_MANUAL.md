# WaterWatch User Manual

## Purpose

WaterWatch helps citizens report water-related civic issues and helps authorities review and resolve them faster using structured complaint data and AI-assisted triage.

This manual is written for two audiences:

- Citizens
- Authority / Admin users

## 1. Citizen Guide

### 1.1 What Citizens Can Do

As a citizen, you can:

- create an account
- log in
- submit a complaint with description, location, and optional image
- view public complaints on the map
- track your submitted complaints
- upvote existing complaints

### 1.2 Before You Start

Prepare the following if possible:

- a clear description of the water issue
- your current location or the exact problem location
- a photo of the issue in `JPEG`, `PNG`, or `WEBP` format
- a stable internet connection

### 1.3 Creating An Account

1. Open the WaterWatch application.
2. Go to the login page.
3. Choose the registration flow.
4. Enter your name, email address, and password.
5. Submit the form.

Notes:

- Use a valid email address.
- Passwords should be at least 8 characters.

### 1.4 Logging In

1. Open the login page.
2. Enter your email and password.
3. Submit the form.

If successful:

- you will receive an authenticated session
- complaint actions and tracking pages become available

### 1.5 Reporting A Water Issue

Go to the `Report` page and fill in the complaint form.

Required fields:

- Issue Type
- Description
- Location

Optional field:

- Photo

#### Issue Types

Choose the option that best matches the problem:

- `Pipe Leak`
- `No Water Supply`
- `Dirty Water`
- `Water Wastage`
- `Other`

#### Description Tips

A good complaint description should include:

- what is happening
- where it is happening
- how severe it seems
- how many people may be affected

Example:

`Continuous water leakage from the roadside main pipe near Lane 4, Madhapur, since early morning. Water is flooding the road and affecting nearby homes.`

#### Photo Upload

If available, upload a clear photo of:

- the leak
- the affected pipe or valve
- dirty water in a container
- the area impacted by overflow or wastage

File rules:

- allowed types: `JPEG`, `PNG`, `WEBP`
- maximum size: `10 MB`

#### Location Confirmation

WaterWatch tries to detect your current location using the browser.

You should:

1. allow location access if prompted
2. verify the detected pin
3. correct the location if the app allows pin movement or manual selection

### 1.6 What Happens After Submission

After you submit a complaint:

1. the complaint is stored
2. the AI analysis service reviews the description and image
3. WaterWatch assigns a suggested category, severity, and priority
4. the complaint becomes visible to authorities
5. the complaint may appear on the public map unless rejected

You may also see:

- complaint ID
- AI summary
- severity badge
- priority label

### 1.7 Tracking Your Complaint

Open the `My Complaints` page to review your submissions.

Each complaint may show:

- complaint ID
- issue type
- submitted date
- AI severity
- AI summary
- current status

### 1.8 Complaint Status Meanings

- `PENDING`: complaint submitted, waiting for review
- `UNDER_REVIEW`: authority is checking details
- `ASSIGNED`: issue assigned to a responsible team or officer
- `IN_PROGRESS`: action has started
- `RESOLVED`: issue marked fixed
- `REJECTED`: complaint rejected due to duplication, invalidity, or insufficient evidence

### 1.9 Viewing The Public Map

The `Map` page is meant to show public complaints without exposing personal information.

You may be able to:

- view issue markers
- check complaint severity
- filter by issue type or status
- search by locality
- use a heatmap view

### 1.10 Upvoting Existing Complaints

If you see a complaint affecting your area, you can upvote it instead of filing a duplicate report.

Use upvotes when:

- the same issue already exists on the map
- you are also affected by that issue

Do not use upvotes for unrelated problems.

## 2. Authority / Admin Guide

### 2.1 What Authority Users Can Do

Authority or admin users can:

- log in to the dashboard
- review all complaints
- filter and search complaints
- update complaint status
- assign complaints
- review AI-generated triage fields
- inspect analytics summaries

### 2.2 Authority Dashboard Overview

The `Dashboard` page is intended to surface:

- total open complaints
- critical issues
- resolved-today count
- average resolution time
- searchable complaint list

The complaint table is expected to show:

- complaint ID
- type
- area
- severity
- priority
- submitted time
- status
- actions

### 2.3 Reviewing A Complaint

When opening a complaint, review:

- citizen description
- image evidence
- issue type
- exact or approximate location
- AI category
- AI severity
- AI priority
- AI summary
- AI confidence

### 2.4 Interpreting AI Output

The AI service suggests:

- `category`
- `severity`
- `priority`
- `summary`
- `suggestedDepartment`
- `confidence`
- `keyFactors`

Treat AI as a decision-support layer, not as the final authority.

You should still verify:

- whether the image matches the description
- whether severity is overstated or understated
- whether the issue is a duplicate
- whether the complaint belongs to the right department

### 2.5 Assigning Complaints

Assign complaints when:

- the issue is valid
- the location is clear enough for action
- the responsible team is known

Typical assignment path:

1. review complaint
2. confirm validity
3. set priority if needed
4. assign to officer or department
5. move status to `ASSIGNED`

### 2.6 Updating Status

Status updates should reflect real operational progress.

Recommended usage:

- `PENDING`: newly created complaint
- `UNDER_REVIEW`: being checked
- `ASSIGNED`: allocated to team
- `IN_PROGRESS`: field or repair work underway
- `RESOLVED`: issue fixed and closed
- `REJECTED`: invalid, duplicate, abusive, or unverifiable

### 2.7 Adding Notes

Use admin notes to record:

- why a complaint was rejected
- duplicate references
- assignment context
- field-team observations
- resolution details

Keep notes factual and concise.

### 2.8 Analytics Page

The analytics page is intended to help authorities identify:

- issue type trends
- severity distribution
- high-volume neighborhoods
- resolution delays
- repeated failures in specific areas

Use analytics for:

- resource planning
- escalation
- preventive maintenance targeting
- weekly or monthly reporting

## 3. Troubleshooting

### 3.1 I Cannot Log In

Possible causes:

- wrong email or password
- expired session
- server unavailable

Try:

1. re-enter credentials
2. refresh the page
3. log in again

### 3.2 Location Is Wrong

Possible causes:

- location permission denied
- GPS unavailable
- browser location inaccuracy

Try:

1. enable browser location access
2. move to an open outdoor area if on mobile
3. manually correct the selected point if supported

### 3.3 Photo Upload Fails

Check:

- file type is `JPEG`, `PNG`, or `WEBP`
- file size is below `10 MB`
- internet connection is stable

### 3.4 Complaint Submission Fails

Possible causes:

- missing required fields
- network interruption
- server validation failure
- upload restriction
- rate limit exceeded

If this happens:

1. verify all fields
2. shorten overly long descriptions
3. retry with a smaller image
4. wait and retry if rate-limited

### 3.5 AI Analysis Is Missing

If AI analysis does not appear immediately:

- the AI service may be temporarily unavailable
- the system may mark analysis as pending
- the complaint can still be reviewed manually by authorities

## 4. Best Practices

### For Citizens

- file one complaint per distinct issue
- use clear descriptions
- attach useful photos
- avoid duplicate reporting when an existing complaint already covers the issue

### For Authorities

- verify AI recommendations before acting
- keep status updates current
- use notes for decisions and exceptions
- prioritize health and high-impact incidents first

## 5. Privacy And Safety

WaterWatch should avoid exposing citizen personal information on public map endpoints.

Users should avoid submitting:

- unrelated personal data
- abusive or false complaints
- private details not needed for issue resolution

## 6. Current Limitations

At the current scaffold stage of this repository:

- some frontend flows are still placeholders
- live map visualization is not fully wired
- analytics charts are not fully connected to real data
- storage is scaffolded and should be replaced with S3 or Cloudinary for production use

## 7. Support

For development and deployment details, see [README.md](C:\Users\gask4\waterwatch\README.md).
