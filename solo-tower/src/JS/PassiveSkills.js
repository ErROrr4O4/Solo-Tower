
function addPassiveSkill(skillName, iconSrc, description) {
    const passiveSkillsList = document.getElementById('passive-skills-list');
    const skillBox = document.createElement('div');
    skillBox.className = 'skill-box';

    const skillIcon = document.createElement('img');
    skillIcon.src = iconSrc;
    skillIcon.alt = skillName;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = description;

    skillBox.appendChild(skillIcon);
    skillBox.appendChild(tooltip);
    passiveSkillsList.appendChild(skillBox);
}

// Example: Adding passive skills
addPassiveSkill('Increased Health Regeneration', '../icons/health-regen.png', 'Regenerates health over time.');
addPassiveSkill('Mana Shield', 'icons/mana_shield.png', 'Absorbs damage using mana.');
addPassiveSkill('Critical Strike Chance', 'icons/crit_chance.png', 'Increases critical strike chance.');
