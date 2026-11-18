# Fix all website files for production deployment

$basePath = 'c:/Users/muna/OneDrive/Dokumenty/esut website'

# 1. Remove BOM from staff.html
$staffPath = "$basePath/staff.html"
$staffContent = [System.IO.File]::ReadAllText($staffPath)
if ($staffContent.StartsWith([char]0xFEFF)) {
    $staffContent = $staffContent.Substring(1)
    [System.IO.File]::WriteAllText($staffPath, $staffContent)
    Write-Host "Removed BOM from staff.html"
}

# Fix whitespace in staff.html script section
$staffContent = [System.IO.File]::ReadAllText($staffPath)
$staffContent = $staffContent -replace '                        const staffData', '            const staffData'
$staffContent = $staffContent -replace '            const allStaff = \(staffData\.staff \|\| \[\)\.filter\(s => s\.name !== ''.Prof\. Agu Solomon Amaechi''\);` + [Environment::NewLine] + [Environment::NewLine], '            const allStaff = (staffData.staff || []).filter(s => s.name !== ''Dr. Prof. Agu Solomon Amaechi'');' + [Environment::NewLine]
[System.IO.File]::WriteAllText($staffPath, $staffContent)
Write-Host "Fixed whitespace in staff.html"

# 2. Add admin modal to all HTML pages that load app.js
$adminModal = @`
    <!-- Admin Modal (for site-wide admin access from any page) -->
    <div id="adminModal" class="admin-modal" style="display:none;">
        <div class="admin-modal-content">
            <span class="admin-close" onclick="closeAdminDashboard()">&times;</span>
            <div id="adminLoginFormContainer">
                <h3>Admin Login</h3>
                <form id="adminLoginForm" onsubmit="handleAdminLogin(event)">
                    <div class="form-group">
                        <label for="adminUsername">Username</label>
                        <input type="text" id="adminUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="adminPassword">Password</label>
                        <input type="password" id="adminPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                <p id="adminLoginMessage" style="color:red; margin-top:10px;"></p>
            </div>
            <div id="adminPanel" style="display:none; margin-top:20px;">
                <h3>Admin Panel</h3>
                <button onclick="showNewsManager()" class="btn btn-secondary">Manage News & Events</button>
                <button onclick="window.location.href='admin website/dashboard.html'" class="btn btn-primary">Open Full Dashboard</button>
                <button onclick="closeAdminDashboard()" class="btn btn-secondary">Close</button>
            </div>
            <div id="newsManager" style="display:none; margin-top:20px;">
                <h3>News & Events Manager</h3>
                <form id="newsForm" onsubmit="addNews(event)">
                    <div class="form-group">
                        <label for="newsTitle">Title</label>
                        <input type="text" id="newsTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="newsSummary">Summary</label>
                        <textarea id="newsSummary" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="newsCategory">Category</label>
                        <select id="newsCategory">
                            <option value="Announcement">Announcement</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Event">Event</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Add News</button>
                    <button type="button" onclick="showNewsManager()" class="btn btn-secondary">Back</button>
                </form>
            </div>
        </div>
    </div>
`@

$htmlFiles = Get-ChildItem -Path $basePath -Filter *.html | Where-Object { $_.Name -notlike '_*' }
foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    # Skip if admin modal already exists
    if ($content -like '*id="adminModal"*') {
        Write-Host "Admin modal already exists in $($file.Name), skipping"
        continue
    }
    
    # Skip admin website files
    if ($file.DirectoryName -like '*admin website*') {
        continue
    }
    
    # Only add to files that load app.js
    if ($content -like '*<script src="app.js"></script>*') {
        # Insert admin modal before </body>
        $content = $content -replace '</body>', $adminModal + "`n</body>"
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Added admin modal to $($file.Name)"
    }
}

Write-Host "`nAll fixes complete!"