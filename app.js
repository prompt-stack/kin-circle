// Family Reunion App - MVP
let familyMembers = [];
let selectedLocation = null;

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to corresponding nav link
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    
    // Trigger section-specific actions
    if (sectionId === 'location') {
        analyzeLocations();
    }
}

// Add event listeners for navigation and zip code lookup
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Add modal zip code lookup functionality
    const modalZipInput = document.getElementById('modalZip');
    if (modalZipInput) {
        modalZipInput.addEventListener('input', function() {
            const zip = this.value.replace(/\D/g, ''); // Remove non-digits
            this.value = zip; // Update input with digits only
            
            if (zip.length === 5) {
                lookupModalZipCode(zip);
            } else if (zip.length > 5) {
                this.value = zip.substring(0, 5); // Limit to 5 digits
            }
            
            // Clear city field if zip is incomplete
            if (zip.length < 5) {
                document.getElementById('modalCity').value = '';
            }
        });
    }
});

// Zip Code Lookup
async function lookupZipCode(zip) {
    const cityField = document.getElementById('memberCity');
    
    // Simple zip code to city mapping (in real app, use a proper API)
    const zipDatabase = {
        '10001': 'New York, NY',
        '90210': 'Beverly Hills, CA',
        '60601': 'Chicago, IL',
        '77001': 'Houston, TX',
        '33101': 'Miami, FL',
        '30301': 'Atlanta, GA',
        '37201': 'Nashville, TN',
        '28201': 'Charlotte, NC',
        '75201': 'Dallas, TX',
        '32801': 'Orlando, FL',
        '45201': 'Cincinnati, OH',
        '37203': 'Nashville, TN'
    };
    
    if (zipDatabase[zip]) {
        cityField.value = zipDatabase[zip];
    } else {
        // In real app, call a zip code API like Zippopotam.us
        try {
            const response = await fetch(`http://api.zippopotam.us/us/${zip}`);
            if (response.ok) {
                const data = await response.json();
                const city = data.places[0]['place name'];
                const state = data.places[0]['state abbreviation'];
                cityField.value = `${city}, ${state}`;
            }
        } catch (error) {
            console.log('Zip lookup failed, using manual entry');
        }
    }
}

// Demo Data
function loadDemoData() {
    const demoMembers = [
        { firstName: 'Sarah', lastName: 'Johnson', zip: '30301', city: 'Atlanta, GA', phone: '(404) 555-0123', email: 'sarah.johnson@email.com' },
        { firstName: 'Marcus', lastName: 'Johnson', zip: '37201', city: 'Nashville, TN', phone: '(615) 555-0456', email: 'marcus.j@email.com' },
        { firstName: 'Lisa', lastName: 'Williams', zip: '28201', city: 'Charlotte, NC', phone: '(704) 555-0789', email: 'lisa.williams@email.com' },
        { firstName: 'David', lastName: 'Brown', zip: '33101', city: 'Miami, FL', phone: '(305) 555-0321', email: 'david.brown@email.com' },
        { firstName: 'Jennifer', lastName: 'Davis', zip: '75201', city: 'Dallas, TX', phone: '(214) 555-0654', email: 'jen.davis@email.com' }
    ];
    
    familyMembers = demoMembers.map((member, index) => ({
        id: Date.now() + index,
        firstName: member.firstName,
        lastName: member.lastName,
        name: `${member.firstName} ${member.lastName}`,
        zip: member.zip,
        city: member.city,
        phone: member.phone,
        email: member.email
    }));
    
    renderFamilyList();
}

// Family Management
function addFamilyMember() {
    const firstName = document.getElementById('memberFirstName').value.trim();
    const lastName = document.getElementById('memberLastName').value.trim();
    const zip = document.getElementById('memberZip').value.trim();
    const city = document.getElementById('memberCity').value.trim();
    const phone = document.getElementById('memberPhone').value.trim();
    const email = document.getElementById('memberEmail').value.trim();
    
    if (!firstName || !lastName) {
        alert('Please enter both first and last name');
        return;
    }
    
    if (zip.length !== 5) {
        alert('Please enter a valid 5-digit zip code');
        return;
    }
    
    if (!city) {
        alert('Please wait for city lookup or enter city manually');
        return;
    }
    
    const member = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        name: `${firstName} ${lastName}`,
        zip: zip,
        city: city,
        phone: phone,
        email: email
    };
    
    familyMembers.push(member);
    renderFamilyList();
    
    // Clear form for easy adding of next member
    document.getElementById('memberFirstName').value = '';
    document.getElementById('memberLastName').value = '';
    document.getElementById('memberZip').value = '';
    document.getElementById('memberCity').value = '';
    document.getElementById('memberPhone').value = '';
    document.getElementById('memberEmail').value = '';
    
    // Focus back to first name for quick entry
    document.getElementById('memberFirstName').focus();
}

function removeFamilyMember(id) {
    familyMembers = familyMembers.filter(member => member.id !== id);
    renderFamilyList();
}

function renderFamilyList() {
    const familyList = document.getElementById('familyList');
    
    if (familyMembers.length === 0) {
        familyList.innerHTML = '<p>No family members added yet. Start by adding your first family member!</p>';
        return;
    }
    
    familyList.innerHTML = `
        <div class="family-summary">
            <h3>Family Members (${familyMembers.length} people added)</h3>
        </div>
        ${familyMembers.map(member => `
            <div class="family-member">
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-location">${member.city}</div>
                    ${member.phone ? `<div class="member-phone">${member.phone}</div>` : ''}
                    ${member.email ? `<div class="member-email">${member.email}</div>` : ''}
                </div>
                <button class="remove-btn" onclick="removeFamilyMember(${member.id})">Remove</button>
            </div>
        `).join('')}
    `;
}

// Location Analysis (AI-powered suggestions)
function analyzeLocations() {
    const analysisDiv = document.getElementById('locationAnalysis');
    const resultsDiv = document.getElementById('locationResults');
    
    if (familyMembers.length === 0) {
        analysisDiv.innerHTML = '<p>Add family members to see location recommendations</p>';
        resultsDiv.innerHTML = '';
        return;
    }
    
    const uniqueCities = [...new Set(familyMembers.map(m => m.city))];
    
    // Show analysis
    analysisDiv.innerHTML = `
        <h3>🤖 AI Analysis</h3>
        <p>Analyzing ${familyMembers.length} family members...</p>
        <p>Locations represented: ${uniqueCities.join(', ')}</p>
        <p>States covered: ${uniqueCities.length} different locations</p>
    `;
    
    // Generate location suggestions (simulated AI)
    const suggestions = generateLocationSuggestions();
    
    resultsDiv.innerHTML = suggestions.map(location => `
        <div class="location-card" onclick="selectLocation('${location.name}', this)">
            <div class="location-name">${location.name}</div>
            <div class="location-details">${location.details}</div>
            <div class="location-score">Score: ${location.score}/100</div>
        </div>
    `).join('');
}

function generateLocationSuggestions() {
    // Simulated AI logic - in real app, this would call OpenAI API
    const cities = familyMembers.map(m => m.city.toLowerCase());
    const suggestions = [];
    
    // Basic logic: suggest central locations
    const commonCities = [
        { name: 'Atlanta, GA', score: 95, details: 'Central location, great airport, family-friendly attractions' },
        { name: 'Nashville, TN', score: 88, details: 'Music city, affordable venues, central to many states' },
        { name: 'Charlotte, NC', score: 85, details: 'Growing city, good hotels, reasonable travel for most' },
        { name: 'Dallas, TX', score: 82, details: 'Major hub, lots of activities, good conference facilities' },
        { name: 'Orlando, FL', score: 90, details: 'Family destination, theme parks, great weather' }
    ];
    
    // Add some logic based on family locations
    if (cities.some(city => city.includes('florida') || city.includes('fl'))) {
        suggestions.push({ name: 'Miami, FL', score: 92, details: 'Beach destination, great weather, local family presence' });
    }
    
    if (cities.some(city => city.includes('california') || city.includes('ca'))) {
        suggestions.push({ name: 'Los Angeles, CA', score: 87, details: 'Entertainment capital, beaches, local family presence' });
    }
    
    // Return top suggestions
    return [...suggestions, ...commonCities].slice(0, 4);
}

function selectLocation(locationName, element) {
    selectedLocation = locationName;
    
    // Highlight selected location using our design tokens
    document.querySelectorAll('.location-card').forEach(card => {
        card.style.borderColor = 'var(--color-gray-200)';
        card.style.backgroundColor = 'var(--color-gray-50)';
    });
    
    element.style.borderColor = 'var(--color-primary)';
    element.style.backgroundColor = 'var(--color-accent-light)';
    
    // Generate venue and activity suggestions
    generateVenuesSuggestions(locationName);
    generateActivitySuggestions(locationName);
}

// Event Planning
function generateVenuesSuggestions(location) {
    const venueResults = document.getElementById('venueResults');
    
    // Simulated venue data - in real app, this would call hotel/venue APIs
    const venues = [
        {
            name: 'Hampton Inn & Suites Downtown',
            details: 'Group rates available, free breakfast, meeting rooms',
            type: 'hotel'
        },
        {
            name: 'Community Center Grand Hall',
            details: 'Large event space, catering kitchen, parking for 200+',
            type: 'venue'
        },
        {
            name: 'Marriott Conference Center',
            details: 'Full-service hotel, event planning, A/V equipment',
            type: 'hotel'
        },
        {
            name: 'Riverside Park Pavilion',
            details: 'Outdoor covered space, BBQ grills, playground nearby',
            type: 'venue'
        }
    ];
    
    venueResults.innerHTML = venues.map(venue => `
        <div class="venue-card">
            <div class="venue-name">${venue.name}</div>
            <div class="venue-details">${venue.details}</div>
        </div>
    `).join('');
}

function generateActivitySuggestions(location) {
    const activityResults = document.getElementById('activityResults');
    
    // Simulated activity data
    const activities = [
        {
            name: 'City Historical Museum',
            details: 'Group tours available, family-friendly exhibits'
        },
        {
            name: 'Riverfront Park & Walking Trail',
            details: 'Free outdoor activity, picnic areas, scenic views'
        },
        {
            name: 'Local Food Tour',
            details: 'Guided tour of local restaurants, group discounts'
        },
        {
            name: 'Bowling & Entertainment Center',
            details: 'Group packages, food service, all-ages fun'
        }
    ];
    
    activityResults.innerHTML = activities.map(activity => `
        <div class="activity-card">
            <div class="activity-name">${activity.name}</div>
            <div class="activity-details">${activity.details}</div>
        </div>
    `).join('');
}

function generatePlan() {
    const eventDate = document.getElementById('eventDate').value;
    
    if (!selectedLocation) {
        alert('Please select a location first');
        return;
    }
    
    if (!eventDate) {
        alert('Please select an event date');
        return;
    }
    
    // Generate comprehensive plan
    const plan = {
        location: selectedLocation,
        date: eventDate,
        attendees: familyMembers.length,
        estimatedCost: calculateEstimatedCost()
    };
    
    // Show plan summary (in real app, this would generate PDF/email)
    alert(`🎉 Family Reunion Plan Generated!
    
Location: ${plan.location}
Date: ${new Date(plan.date).toLocaleDateString()}
Expected Attendees: ${plan.attendees}
Estimated Cost: $${plan.estimatedCost}

Next steps:
1. Send invitations to family members
2. Book venue and accommodations
3. Coordinate travel arrangements
4. Plan activities and meals

Would you like to upgrade to our premium planning service for $49?`);
}

function calculateEstimatedCost() {
    // Simple cost estimation based on number of family members
    const baseVenueCost = 500;
    const perPersonCost = 75;
    const total = baseVenueCost + (familyMembers.length * perPersonCost);
    return total;
}

// Modal Functions
function openAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'block';
    // Focus on first input
    setTimeout(() => {
        document.getElementById('modalFirstName').focus();
    }, 100);
}

function closeAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'none';
    // Clear form
    document.getElementById('modalFirstName').value = '';
    document.getElementById('modalLastName').value = '';
    document.getElementById('modalZip').value = '';
    document.getElementById('modalCity').value = '';
    document.getElementById('modalPhone').value = '';
    document.getElementById('modalEmail').value = '';
}

// Modal Zip Code Lookup
async function lookupModalZipCode(zip) {
    const cityField = document.getElementById('modalCity');
    
    // Simple zip code to city mapping (in real app, use a proper API)
    const zipDatabase = {
        '10001': 'New York, NY',
        '90210': 'Beverly Hills, CA',
        '60601': 'Chicago, IL',
        '77001': 'Houston, TX',
        '33101': 'Miami, FL',
        '30301': 'Atlanta, GA',
        '37201': 'Nashville, TN',
        '28201': 'Charlotte, NC',
        '75201': 'Dallas, TX',
        '32801': 'Orlando, FL',
        '45201': 'Cincinnati, OH',
        '37203': 'Nashville, TN'
    };
    
    if (zipDatabase[zip]) {
        cityField.value = zipDatabase[zip];
    } else {
        // In real app, call a zip code API like Zippopotam.us
        try {
            const response = await fetch(`http://api.zippopotam.us/us/${zip}`);
            if (response.ok) {
                const data = await response.json();
                const city = data.places[0]['place name'];
                const state = data.places[0]['state abbreviation'];
                cityField.value = `${city}, ${state}`;
            }
        } catch (error) {
            console.log('Zip lookup failed, using manual entry');
        }
    }
}

// Add Family Member from Modal
function addFamilyMemberFromModal() {
    const firstName = document.getElementById('modalFirstName').value.trim();
    const lastName = document.getElementById('modalLastName').value.trim();
    const zip = document.getElementById('modalZip').value.trim();
    const city = document.getElementById('modalCity').value.trim();
    const phone = document.getElementById('modalPhone').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    
    if (!firstName || !lastName) {
        alert('Please enter both first and last name');
        return;
    }
    
    if (zip.length !== 5) {
        alert('Please enter a valid 5-digit zip code');
        return;
    }
    
    if (!city) {
        alert('Please wait for city lookup or enter city manually');
        return;
    }
    
    const member = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        name: `${firstName} ${lastName}`,
        zip: zip,
        city: city,
        phone: phone,
        email: email
    };
    
    familyMembers.push(member);
    renderFamilyList();
    closeAddMemberModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addMemberModal');
    if (event.target === modal) {
        closeAddMemberModal();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    renderFamilyList();
});