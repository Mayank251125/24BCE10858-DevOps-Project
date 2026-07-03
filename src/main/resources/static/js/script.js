document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navUl = document.querySelector('nav ul');
    if (menuBtn && navUl) {
        menuBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (navUl.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }

    // 2. Event Countdown (VIT TechFest 2026: Nov 15, 2026)
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        const targetDate = new Date("Nov 15, 2026 09:00:00").getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff < 0) {
                document.querySelector('.countdown').innerHTML = '<div style="font-size: 20px; font-weight: 600; color: #38bdf8;">TECHFEST HAS BEGUN!</div>';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            daysEl.innerText = String(days).padStart(2, '0');
            hoursEl.innerText = String(hours).padStart(2, '0');
            minutesEl.innerText = String(minutes).padStart(2, '0');
            secondsEl.innerText = String(seconds).padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // 3. Schedule Track Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (filterBtns.length > 0 && timelineItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                timelineItems.forEach(item => {
                    const tag = item.querySelector('.track-tag');
                    if (filter === 'all') {
                        item.style.display = 'flex';
                    } else if (tag && tag.innerText.toLowerCase().includes(filter.toLowerCase())) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. Ticket Pricing Calculator
    const ticketTypeSelect = document.getElementById('ticket-type');
    const ticketQuantityInput = document.getElementById('ticket-quantity');
    const totalPriceEl = document.getElementById('total-price');

    if (ticketTypeSelect && ticketQuantityInput && totalPriceEl) {
        const calculatePrice = () => {
            const price = parseFloat(ticketTypeSelect.value) || 0;
            const qty = parseInt(ticketQuantityInput.value) || 1;
            totalPriceEl.innerText = `₹${price * qty}`;
        };

        ticketTypeSelect.addEventListener('change', calculatePrice);
        ticketQuantityInput.addEventListener('input', calculatePrice);
        calculatePrice(); // Run initially
    }

    // 5. Toast Feedback Helper
    const showToast = (msg) => {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <i class="fas fa-check-circle" style="color: #10b981; font-size: 18px;"></i>
                <span class="toast-message"></span>
            `;
            document.body.appendChild(toast);
        }
        toast.querySelector('.toast-message').innerText = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // 6. Registration Form Validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const inputs = registerForm.querySelectorAll('.form-control');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    if (input.type === 'email' && !input.value.includes('@')) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                const name = document.getElementById('reg-name')?.value || "Participant";
                showToast(`Registration Successful! Welcome, ${name}.`);
                registerForm.reset();
                if (totalPriceEl) totalPriceEl.innerText = '₹500';
            }
        });
    }

    // 7. Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const inputs = contactForm.querySelectorAll('.form-control');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                    if (input.type === 'email' && !input.value.includes('@')) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                showToast(`Thank you! Your message has been sent successfully.`);
                contactForm.reset();
            }
        });
    }

    // 8. REST Task Manager API (Executed only on tasks.html)
    const taskForm = document.getElementById('task-form');
    const tasksListContainer = document.getElementById('tasks-list');
    
    if (taskForm || tasksListContainer) {
        const taskTitleInput = document.getElementById('task-title');
        const taskDescInput = document.getElementById('task-desc');
        const activeCountSpan = document.getElementById('active-count');
        const API_URL = '/api/tasks';

        const fetchTasks = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch tasks');
                const tasks = await response.json();
                renderTasks(tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                if (tasksListContainer) {
                    tasksListContainer.innerHTML = `
                        <div style="text-align: center; color: #ef4444; padding: 20px;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 28px; margin-bottom: 10px;"></i>
                            <p>Failed to connect to Spring Boot backend API.</p>
                        </div>
                    `;
                }
            }
        };

        const renderTasks = (tasks) => {
            if (!tasksListContainer) return;
            if (tasks.length === 0) {
                tasksListContainer.innerHTML = `
                    <div style="text-align: center; color: #64748b; padding: 30px;">
                        <i class="fas fa-clipboard-list" style="font-size: 40px; margin-bottom: 10px; opacity: 0.5;"></i>
                        <p>No tasks available.</p>
                    </div>
                `;
                if (activeCountSpan) activeCountSpan.innerText = '0 Tasks';
                return;
            }

            tasks.sort((a, b) => a.completed - b.completed || a.id - b.id);
            tasksListContainer.innerHTML = '';
            let activeCount = 0;

            tasks.forEach(task => {
                if (!task.completed) activeCount++;
                const taskItem = document.createElement('div');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.innerHTML = `
                    <div class="task-info">
                        <h3>${escapeHTML(task.title)}</h3>
                        <p>${escapeHTML(task.description)}</p>
                    </div>
                    <div class="task-actions">
                        <span class="complete-btn ${task.completed ? 'completed' : ''}" data-id="${task.id}" data-completed="${task.completed}">
                            <i class="${task.completed ? 'fas fa-check-circle' : 'far fa-circle'}"></i>
                        </span>
                        <button class="delete-btn" data-id="${task.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                tasksListContainer.appendChild(taskItem);
            });

            if (activeCountSpan) {
                activeCountSpan.innerText = `${activeCount} Active Task${activeCount === 1 ? '' : 's'}`;
            }
            bindActionListeners();
        };

        const bindActionListeners = () => {
            document.querySelectorAll('.complete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const completed = btn.getAttribute('data-completed') === 'true';
                    try {
                        const taskResponse = await fetch(`${API_URL}/${id}`);
                        const task = await taskResponse.json();
                        task.completed = !completed;
                        
                        const response = await fetch(`${API_URL}/${id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(task)
                        });
                        if (response.ok) {
                            showToast(`Task marked as ${task.completed ? 'completed' : 'active'}!`);
                            fetchTasks();
                        }
                    } catch (err) {
                        console.error('Error updating task:', err);
                    }
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this task?')) {
                        try {
                            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                            if (response.ok) {
                                showToast('Task deleted successfully!');
                                fetchTasks();
                            }
                        } catch (err) {
                            console.error('Error deleting task:', err);
                        }
                    }
                });
            });
        };

        if (taskForm) {
            taskForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                let isValid = true;

                if (!taskTitleInput.value.trim()) {
                    taskTitleInput.classList.add('is-invalid');
                    isValid = false;
                } else {
                    taskTitleInput.classList.remove('is-invalid');
                }

                if (!taskDescInput.value.trim()) {
                    taskDescInput.classList.add('is-invalid');
                    isValid = false;
                } else {
                    taskDescInput.classList.remove('is-invalid');
                }

                if (!isValid) return;

                const newTask = {
                    title: taskTitleInput.value.trim(),
                    description: taskDescInput.value.trim(),
                    completed: false
                };

                try {
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newTask)
                    });
                    if (response.ok) {
                        showToast('New task added successfully!');
                        taskForm.reset();
                        fetchTasks();
                    }
                } catch (err) {
                    console.error('Error adding task:', err);
                }
            });
        }

        const escapeHTML = (str) => {
            return str.replace(/[&<>'"]/g, tag => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
            }[tag] || tag));
        };

        fetchTasks();
    }
});
