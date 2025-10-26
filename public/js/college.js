/**
 * College Management Module
 * Handles college search, filtering, and display functionality
 */

class CollegeManager {
    constructor() {
        this.colleges = [];
        this.filteredColleges = [];
        this.currentPage = 1;
        this.collegesPerPage = 12;
        this.filters = {
            location: '',
            program: '',
            feeRange: 50000,
            ranking: ''
        };
        this.sortBy = 'ranking';
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Filter elements
        this.locationFilter = document.getElementById('location-filter');
        this.programFilter = document.getElementById('program-filter');
        this.feeRange = document.getElementById('fee-range');
        this.feeValue = document.getElementById('fee-value');
        this.rankingFilter = document.getElementById('ranking-filter');
        this.applyFiltersBtn = document.getElementById('apply-filters');
        
        // Results elements
        this.resultsCount = document.getElementById('results-count');
        this.sortBy = document.getElementById('sort-by');
        this.collegeGrid = document.getElementById('college-grid');
        this.loading = document.getElementById('loading');
        
        // Pagination elements
        this.pagination = document.getElementById('pagination');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        this.currentPageSpan = document.getElementById('current-page');
        this.totalPagesSpan = document.getElementById('total-pages');
        
        // Template
        this.collegeCardTemplate = document.getElementById('college-card-template');
    }

    bindEvents() {
        // Fee range slider
        this.feeRange?.addEventListener('input', (e) => {
            this.updateFeeDisplay(e.target.value);
        });

        // Apply filters button
        this.applyFiltersBtn?.addEventListener('click', () => {
            this.applyFilters();
        });

        // Sort change
        this.sortBy?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.sortAndDisplayColleges();
        });

        // Pagination
        this.prevPageBtn?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.displayColleges();
            }
        });

        this.nextPageBtn?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredColleges.length / this.collegesPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.displayColleges();
            }
        });
    }

    async init() {
        try {
            this.showLoading(true);
            await this.loadColleges();
            this.filteredColleges = [...this.colleges];
            this.sortAndDisplayColleges();
        } catch (error) {
            console.error('Error initializing college manager:', error);
            this.showError('Failed to load colleges. Please try again later.');
        } finally {
            this.showLoading(false);
        }
    }

    async loadColleges() {
        try {
            // Check if user is authenticated
            const user = firebase.auth().currentUser;
            
            // Load colleges from Firestore
            const collegesSnapshot = await firebase.firestore()
                .collection('colleges')
                .orderBy('ranking.global', 'asc')
                .get();

            this.colleges = collegesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // If no colleges in database, load sample data
            if (this.colleges.length === 0) {
                this.colleges = this.getSampleColleges();
            }

        } catch (error) {
            console.error('Error loading colleges:', error);
            // Fallback to sample data
            this.colleges = this.getSampleColleges();
        }
    }

    getSampleColleges() {
        return [
            {
                id: 'mit',
                name: 'Massachusetts Institute of Technology',
                location: {
                    country: 'USA',
                    state: 'Massachusetts',
                    city: 'Cambridge'
                },
                type: 'Private',
                establishedYear: 1861,
                fees: {
                    tuition: 57590,
                    total: 75790,
                    currency: 'USD'
                },
                programs: ['Engineering', 'Computer Science', 'Business'],
                ranking: {
                    global: 1,
                    national: 1
                },
                acceptanceRate: 6.7,
                image: 'https://via.placeholder.com/300x200?text=MIT',
                description: 'Leading research university known for science and technology.'
            },
            {
                id: 'stanford',
                name: 'Stanford University',
                location: {
                    country: 'USA',
                    state: 'California',
                    city: 'Stanford'
                },
                type: 'Private',
                establishedYear: 1885,
                fees: {
                    tuition: 56169,
                    total: 74570,
                    currency: 'USD'
                },
                programs: ['Engineering', 'Computer Science', 'Business', 'Medicine'],
                ranking: {
                    global: 2,
                    national: 2
                },
                acceptanceRate: 4.3,
                image: 'https://via.placeholder.com/300x200?text=Stanford',
                description: 'Premier research university in Silicon Valley.'
            },
            {
                id: 'iit-bombay',
                name: 'Indian Institute of Technology Bombay',
                location: {
                    country: 'India',
                    state: 'Maharashtra',
                    city: 'Mumbai'
                },
                type: 'Government',
                establishedYear: 1958,
                fees: {
                    tuition: 200000,
                    total: 245000,
                    currency: 'INR'
                },
                programs: ['Engineering', 'Computer Science', 'Management'],
                ranking: {
                    global: 177,
                    national: 1
                },
                acceptanceRate: 1.2,
                image: 'https://via.placeholder.com/300x200?text=IIT+Bombay',
                description: 'Premier engineering institute in India.'
            }
        ];
    }

    updateFeeDisplay(value) {
        this.feeValue.textContent = `$${parseInt(value).toLocaleString()}`;
        this.filters.feeRange = parseInt(value);
    }

    applyFilters() {
        // Get filter values
        this.filters.location = this.locationFilter.value;
        this.filters.program = this.programFilter.value;
        this.filters.ranking = this.rankingFilter.value;

        // Apply filters
        this.filteredColleges = this.colleges.filter(college => {
            // Location filter
            if (this.filters.location && college.location.country.toLowerCase() !== this.filters.location) {
                return false;
            }

            // Program filter
            if (this.filters.program && !college.programs.some(program => 
                program.toLowerCase().includes(this.filters.program.toLowerCase()))) {
                return false;
            }

            // Fee range filter
            const fees = college.fees.currency === 'USD' ? college.fees.total : college.fees.total / 80; // Convert INR to USD roughly
            if (fees > this.filters.feeRange) {
                return false;
            }

            // Ranking filter
            if (this.filters.ranking) {
                const rankLimit = parseInt(this.filters.ranking.split('-')[1]);
                if (college.ranking.global > rankLimit) {
                    return false;
                }
            }

            return true;
        });

        // Reset to first page
        this.currentPage = 1;
        this.sortAndDisplayColleges();
    }

    sortAndDisplayColleges() {
        // Sort colleges
        this.filteredColleges.sort((a, b) => {
            switch (this.sortBy) {
                case 'ranking':
                    return a.ranking.global - b.ranking.global;
                case 'fees':
                    const feesA = a.fees.currency === 'USD' ? a.fees.total : a.fees.total / 80;
                    const feesB = b.fees.currency === 'USD' ? b.fees.total : b.fees.total / 80;
                    return feesA - feesB;
                case 'fees-desc':
                    const feesDescA = a.fees.currency === 'USD' ? a.fees.total : a.fees.total / 80;
                    const feesDescB = b.fees.currency === 'USD' ? b.fees.total : b.fees.total / 80;
                    return feesDescB - feesDescA;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        this.displayColleges();
    }

    displayColleges() {
        // Clear current display
        this.collegeGrid.innerHTML = '';

        // Update results count
        this.resultsCount.textContent = this.filteredColleges.length;

        // Calculate pagination
        const totalPages = Math.ceil(this.filteredColleges.length / this.collegesPerPage);
        const startIndex = (this.currentPage - 1) * this.collegesPerPage;
        const endIndex = startIndex + this.collegesPerPage;
        const collegesToShow = this.filteredColleges.slice(startIndex, endIndex);

        // Display colleges
        collegesToShow.forEach(college => {
            const collegeCard = this.createCollegeCard(college);
            this.collegeGrid.appendChild(collegeCard);
        });

        // Update pagination
        this.updatePagination(totalPages);

        // Show/hide pagination
        this.pagination.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    createCollegeCard(college) {
        const template = this.collegeCardTemplate.content.cloneNode(true);
        
        // Fill in college data
        template.querySelector('.college-img').src = college.image || 'https://via.placeholder.com/300x200?text=College';
        template.querySelector('.college-img').alt = college.name;
        template.querySelector('.rank-number').textContent = college.ranking.global;
        template.querySelector('.college-name').textContent = college.name;
        template.querySelector('.location-text').textContent = `${college.location.city}, ${college.location.country}`;
        
        // Programs
        const programTags = template.querySelector('.program-tags');
        college.programs.slice(0, 3).forEach(program => {
            const tag = document.createElement('span');
            tag.className = 'program-tag';
            tag.textContent = program;
            programTags.appendChild(tag);
        });

        // Stats
        const feesText = college.fees.currency === 'USD' 
            ? `$${college.fees.total.toLocaleString()}`
            : `₹${college.fees.total.toLocaleString()}`;
        template.querySelector('.fees').textContent = feesText;
        template.querySelector('.acceptance-rate').textContent = `${college.acceptanceRate}%`;

        // Buttons
        const viewDetailsBtn = template.querySelector('.view-details');
        const applyNowBtn = template.querySelector('.apply-now');
        
        viewDetailsBtn.setAttribute('data-college-id', college.id);
        applyNowBtn.setAttribute('data-college-id', college.id);

        // Event listeners
        viewDetailsBtn.addEventListener('click', () => {
            this.viewCollegeDetails(college.id);
        });

        applyNowBtn.addEventListener('click', () => {
            this.applyToCollege(college.id);
        });

        return template;
    }

    updatePagination(totalPages) {
        this.currentPageSpan.textContent = this.currentPage;
        this.totalPagesSpan.textContent = totalPages;
        
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;
    }

    viewCollegeDetails(collegeId) {
        // Navigate to college details page
        window.location.href = `college-details.html?id=${collegeId}`;
    }

    async applyToCollege(collegeId) {
        try {
            // Check if user is logged in
            const user = firebase.auth().currentUser;
            if (!user) {
                // Redirect to login
                window.location.href = 'student-login.html?redirect=college-list.html';
                return;
            }

            // Navigate to application page
            window.location.href = `college-application.html?id=${collegeId}`;

        } catch (error) {
            console.error('Error applying to college:', error);
            alert('Error applying to college. Please try again.');
        }
    }

    showLoading(show) {
        this.loading.style.display = show ? 'flex' : 'none';
        this.collegeGrid.style.display = show ? 'none' : 'grid';
    }

    showError(message) {
        this.collegeGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

// Export for use in other modules
window.CollegeManager = CollegeManager;
