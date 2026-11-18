import re
import html

def read_file(filename):
    for enc in ['utf-8', 'utf-16', 'latin-1', 'cp1252']:
        try:
            with open(filename, 'r', encoding=enc) as f:
                return f.read()
        except (UnicodeDecodeError, UnicodeError):
            continue
    raise ValueError(f"Could not read {filename}")

# ---- Step 1: Extract all courses from academics.html ----
academics = read_file('academics.html')
course_pattern = re.compile(r'<tr><td>([^<]+)</td><td>([^<]+)</td>')
academic_courses = []
for m in course_pattern.finditer(academics):
    code = m.group(1).strip()
    title = m.group(2).strip()
    if code and title and not code.startswith('Total'):
        academic_courses.append((code, title))

# Deduplicate
seen = set()
unique_academic = []
for code, title in academic_courses:
    if code not in seen:
        seen.add(code)
        unique_academic.append((code, title))

print(f"Total unique courses in academics: {len(unique_academic)}")

# ---- Step 2: Extract existing descriptions from backup ----
backup = read_file('check_400level.txt')
# Find all article blocks with course-description-item
article_pattern = re.compile(
    r'<article class="course-description-item">.*?</article>',
    re.DOTALL
)
existing_blocks = {}
for m in article_pattern.finditer(backup):
    block = m.group(0)
    code_match = re.search(r'<span class="course-code">([^<]+)</span>', block)
    title_match = re.search(r'<span class="course-title">([^<]+)</span>', block)
    if code_match:
        code = code_match.group(1).strip()
        title = title_match.group(1).strip() if title_match else ''
        existing_blocks[code] = {
            'block': block,
            'title': title
        }

print(f"Extracted {len(existing_blocks)} existing course blocks from backup")

# ---- Step 3: Group academic courses by level ----
def get_level(code):
    match = re.search(r'(\d{3})', code)
    if match:
        num = int(match.group(1))
        if num < 200: return '100'
        elif num < 300: return '200'
        elif num < 400: return '300'
        else: return '400'
    return '100'

level_order = {'100': 0, '200': 1, '300': 2, '400': 3}
sorted_courses = sorted(unique_academic, key=lambda x: (level_order.get(get_level(x[0]), 0), x[0]))

levels = {}
for code, title in sorted_courses:
    lvl = get_level(code)
    levels.setdefault(lvl, []).append((code, title))

print(f"\nCourses by level:")
for lvl in sorted(levels.keys(), key=lambda x: level_order.get(x, 0)):
    print(f"  Level {lvl}: {len(levels[lvl])} courses")

# ---- Step 4: Determine missing courses and generate blocks ----
def generate_placeholder_block(sequence, code, title, level):
    """Generate a placeholder block for a course without a description."""
    return f'''                                <article class="course-description-item">
                                    <div class="description-header">
                                        <span class="course-sequence">{sequence}</span>
                                        <span class="course-code">{code}</span>
                                        <span class="course-title">{title}</span>
                                        <span class="course-meta">Level {level} � Second Semester � 2 Units � Compulsory � Lecture 30 h / Practical 0 h</span>
                                    </div>
                                    <div class="description-body">
                                        <h4>No course description for this course.</h4>
                                        <p><em>No course description for this course.</em></p>
                                    </div>
                                </article>'''

# Find missing courses
missing = []
existing_codes = set(existing_blocks.keys())
for code, title in unique_academic:
    if code not in existing_codes:
        missing.append((code, title))

print(f"\nMissing courses (need placeholders): {len(missing)}")
for code, title in missing:
    print(f"  {code}: {title}")

# Reuse existing blocks if available; otherwise generate placeholder
# Track sequence per level
level_sequence = {'100': 0, '200': 0, '300': 0, '400': 0}

all_level_content = {}
for lvl in sorted(levels.keys(), key=lambda x: level_order.get(x, 0)):
    articles = []
    for code, title in levels[lvl]:
        level_sequence[lvl] += 1
        seq = level_sequence[lvl]
        if code in existing_blocks:
            articles.append(existing_blocks[code]['block'])
        else:
            articles.append(generate_placeholder_block(seq, code, title, lvl))
    all_level_content[lvl] = '\n'.join(articles)

print("\nDone preparing all course blocks.")

# ---- Step 5: Build full HTML output ----
level_titles = {'100': 'Level 100 Courses', '200': 'Level 200 Courses', '300': 'Level 300 Courses', '400': 'Level 400 Courses'}

# Build jump navigation
jump_nav_links = []
for lvl in sorted(levels.keys(), key=lambda x: level_order.get(x, 0)):
    jump_nav_links.append(f'                        <a href="#level-{lvl}">Level {lvl}</a>')
jump_nav_html = '\n'.join(jump_nav_links)

# Build level sections
level_sections = []
for lvl in sorted(levels.keys(), key=lambda x: level_order.get(x, 0)):
    section_html = f'''                    <div class="level-section" id="level-{lvl}">
                        <h2 class="level-title">{level_titles[lvl]}</h2>
                        <div class="courses-grid">
{all_level_content[lvl]}
                        </div>
                    </div>'''
    level_sections.append(section_html)

level_sections_html = '\n'.join(level_sections)

full_html_head = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Descriptions - Department of Psychology | ESUT</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="responsive.css">
</head>
<body>
    <header class="header">
        <div class="top-bar">
            <div class="container">
                <div class="top-bar-content">
                    <div class="logo-section">
                        <img src="Enugu-State-University-of-Science-and-Technology-logo.jpg" alt="ESUT Logo" class="logo-img">
                        <div class="logo-text">
                            <h1>Department of Psychology</h1>
                            <p class="logo-subtext">Enugu State University of Science and Technology</p>
                        </div>
                    </div>
                    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle navigation">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>
        <nav class="nav-bar" id="navBar">
            <div class="container">
                <ul class="nav-menu">
                    <li class="nav-item"><a href="index.html" class="nav-link"><i class="fas fa-home"></i> Home</a></li>
                    <li class="nav-item"><a href="about.html" class="nav-link"><i class="fas fa-info-circle"></i> About Us</a></li>
                    <li class="nav-item"><a href="programs.html" class="nav-link"><i class="fas fa-graduation-cap"></i> Programs</a></li>
                    <li class="nav-item"><a href="academics.html" class="nav-link"><i class="fas fa-book-open"></i> Academics</a></li>
                    <li class="nav-item active"><a href="course-descriptions.html" class="nav-link"><i class="fas fa-book-open"></i> Course Descriptions</a></li>
                    <li class="nav-item"><a href="news.html" class="nav-link"><i class="fas fa-newspaper"></i> News & Events</a></li>
                    <li class="nav-item"><a href="staff.html" class="nav-link"><i class="fas fa-users"></i> Staff</a></li>
                    <li class="nav-item"><a href="contact.html" class="nav-link"><i class="fas fa-envelope"></i> Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main id="main-content">
        <section class="page-hero">
            <div class="container">
                <h1 class="page-title">Course Descriptions</h1>
                <ul class="breadcrumb">
                    <li><a href="index.html">Home</a></li>
                    <li><i class="fas fa-chevron-right"></i></li>
                    <li><a href="academics.html">Academics</a></li>
                </ul>
            </div>
        </section>

        <nav class="level-jump-nav" aria-label="Jump to course description level">
            <div class="container">
'''

full_html_middle = f'''{jump_nav_html}
            </div>
        </nav>

        <section class="page-content">
            <div class="container">
                <div class="content-card">
                    <h2 class="section-title">Course Description Library</h2>
                    <p>Detailed course descriptions organised by academic level and semester to make the curriculum easier to navigate.</p>
{level_sections_html}
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Department of Psychology</h3>
                    <p>ESUT</p>
                    <p><i class="fas fa-map-marker-alt"></i> ESUT Campus, Agbani, Enugu State, Nigeria</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="academics.html">Academics</a></li>
                        <li><a href="news.html">News &amp; Events</a></li>
                        <li><a href="staff.html">Resources</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <p><i class="fas fa-envelope"></i> psychology@esut.edu.ng</p>
                    <p><i class="fas fa-phone"></i> +234 (0) 800 000 0000</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Department of Psychology, ESUT. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>'''

full_html = full_html_head + full_html_middle

# ---- Step 6: Write output file ----
with open('course-descriptions.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

print(f"\nWritten course-descriptions.html ({len(full_html)} characters)")
print(f"Total courses: {len(unique_academic)}, Existing blocks: {len(existing_blocks)}, Missing/placeholder: {len(missing)}")