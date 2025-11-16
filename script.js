function initCursor() {
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    requestAnimationFrame(() => {
      glowX += (mouseX - glowX) * 0.3;
      glowY += (mouseY - glowY) * 0.3;

      cursorGlow.style.left = glowX - 20 + 'px';
      cursorGlow.style.top = glowY - 20 + 'px';
    });

    cursorGlow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.classList.add('active');
  });

  const interactiveElements =
    document.querySelectorAll('a, button, .stat-card, .channel-item, input, textarea');

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorGlow.style.width = '60px';
      cursorGlow.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursorGlow.style.width = '40px';
      cursorGlow.style.height = '40px';
    });
  });
}

 const DISCORD_API_URL = 'https://sarthak-s-backend.onrender.com/api/discord-stats'


const REFRESH_INTERVAL = 10000;

async function fetchStats() {
  try {
    const response = await fetch(DISCORD_API_URL);
    const data = await response.json();

    if (response.ok) {
      const memberCountEl = document.querySelector('[data-stat="memberCount"]');
      if (memberCountEl) memberCountEl.textContent = data.totalMembers;

      const onlineCountEl = document.querySelector('[data-stat="onlineCount"]');
      if (onlineCountEl) onlineCountEl.textContent = data.onlineMembers;

      const boostersEl = document.querySelector('[data-stat="boosters"]');
      if (boostersEl) boostersEl.textContent = data.boostCount;

      const boostLevelEl = document.querySelector('[data-stat="boostLevel"]');
      if (boostLevelEl) boostLevelEl.textContent = data.boostLevel;

      const channelCountEl = document.querySelector('[data-stat="channelCount"]');
      if (channelCountEl) channelCountEl.textContent = data.channels;

      const roleCountEl = document.querySelector('[data-stat="roleCount"]');
      if (roleCountEl) roleCountEl.textContent = data.roles;

      const textSection = document.getElementById("text-channels-section");
      const voiceSection = document.getElementById("voice-channels-section");
      const textList = document.getElementById("text-channels-list");
      const voiceList = document.getElementById("voice-channels-list");
      const emptyMsg = document.getElementById("channels-empty");

      textSection.style.display = "none";
      voiceSection.style.display = "none";
      emptyMsg.style.display = "block";

      textList.innerHTML = "";
      voiceList.innerHTML = "";

      if (Array.isArray(data.channelList) && data.channelList.length > 0) {
        let hasText = false;
        let hasVoice = false;

        data.channelList.forEach((channel) => {
          const div = document.createElement("div");
          div.className = "channel-item";
          div.innerHTML = `<span># ${channel.name}</span>`;

          if (channel.type === 0) {
            textList.appendChild(div);
            hasText = true;
          } else if (channel.type === 2) {
            voiceList.appendChild(div);
            hasVoice = true;
          }
        });

        if (hasText) textSection.style.display = "block";
        if (hasVoice) voiceSection.style.display = "block";
        if (hasText || hasVoice) emptyMsg.style.display = "none";
      }

      const boostLevel = parseInt(data.boostLevel);
      const boostBars = document.querySelectorAll(".boost-bar");

      boostBars.forEach((bar, index) => {
        if (index < boostLevel) {
          bar.style.opacity = "1";
          bar.style.backgroundColor = "#5865f2";
        } else {
          bar.style.opacity = "0.3";
        }
      });

      const iconEl = document.getElementById("server-icon");
      if (iconEl && data.serverIcon) {
        iconEl.src = data.serverIcon;
        iconEl.style.display = "block";
      } else if (iconEl) {
        iconEl.style.display = "none";
      }

      console.log("Discord stats updated!", data);

    } else {
      console.error("Error fetching stats:", data.error);
    }

  } catch (error) {
    console.error("Failed to fetch stats:", error);
  }
}

function init() {
  initCursor();
  fetchStats();
  setInterval(fetchStats, REFRESH_INTERVAL);
}

window.addEventListener("DOMContentLoaded", init);
