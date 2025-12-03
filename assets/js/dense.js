// Dense, multi-part experimental UI
// Gated behind:
//   - site.dense_features.enabled (Jekyll config)
//   - ?show_multi_part query parameter

(function () {
  function hasShowMultiPartFlag() {
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.has('show_multi_part')) return true;
    } catch (e) {
      // URLSearchParams may not be available; fall through to false.
    }
    return false;
  }

  function initShowMultiPart() {
    var enabled = hasShowMultiPartFlag();
    document.documentElement.setAttribute(
      'data-show-multi-part',
      enabled ? 'true' : 'false'
    );

    var gated = document.querySelectorAll(
      '[data-requires-show-multi-part="true"]'
    );
    gated.forEach(function (el) {
      if (enabled) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', 'hidden');
      }
    });
  }

  function textStats(text) {
    var cleaned = (text || '')
      .replace(/\s+/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .trim();
    if (!cleaned) {
      return {
        words: 0,
        unique: 0,
        hasLink: false,
        hasEquation: false,
      };
    }
    var words = cleaned.split(' ').filter(Boolean);
    var uniqueSet = Object.create(null);
    words.forEach(function (w) {
      uniqueSet[w.toLowerCase()] = true;
    });
    var links = /https?:\/\/\S+|\[\d+\]/i.test(text || '');
    var equations =
      /[=<>]\s*\d|\bO\([\w^]+\)|\bETA\b|\bsum\b|∑|∫|≈|≥|≤/.test(text || '');
    return {
      words: words.length,
      unique: Object.keys(uniqueSet).length,
      hasLink: links,
      hasEquation: equations,
    };
  }

  function computeDensity(stats) {
    if (!stats || !stats.words) return 0;
    var vocabRatio = stats.unique / stats.words; // 0–1
    var linkBonus = stats.hasLink ? 0.2 : 0;
    var eqBonus = stats.hasEquation ? 0.2 : 0;
    var base = vocabRatio + linkBonus + eqBonus;
    var bitsPer100 = Math.max(0, Math.min(4, base * 4)); // cap at ~4
    return Math.round(bitsPer100 * 10) / 10;
  }

  function safeRead(key, fallback) {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function safeWrite(key, value) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore
    }
  }

  var DENSE_ACCOUNT = safeRead('dense-account', null);
  if (DENSE_ACCOUNT) {
    try {
      window.DENSE_ACCOUNT_EMAIL = DENSE_ACCOUNT.email || '';
      window.DENSE_ACTIVE_HANDLE = DENSE_ACCOUNT.handle || '';
    } catch (e) {
      // ignore
    }
  }

  function hasDenseAccount() {
    return !!(
      (typeof window !== 'undefined' &&
        (window.DENSE_ACTIVE_HANDLE || window.DENSE_ACCOUNT_EMAIL)) ||
      (DENSE_ACCOUNT && (DENSE_ACCOUNT.handle || DENSE_ACCOUNT.email))
    );
  }

  var DENSE_BACKEND_URL =
    (typeof window !== 'undefined' && window.DENSE_BACKEND_URL) ||
    'http://106.14.213.46:4000';

  function backendPost(path, payload) {
    if (typeof fetch === 'undefined' || !DENSE_BACKEND_URL) {
      return Promise.resolve(false);
    }
    var base = DENSE_BACKEND_URL.replace(/\/+$/, '');
    var url = base + path;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
      keepalive: true,
    })
      .then(function (res) {
        return res.ok;
      })
      .catch(function () {
        return false;
      });
  }

  function ensureAuthModal() {
    var existing = document.querySelector('[data-dense-auth-modal]');
    if (existing) return existing;

    var wrapper = document.createElement('div');
    wrapper.className = 'dense-auth-modal';
    wrapper.setAttribute('data-dense-auth-modal', 'true');
    wrapper.innerHTML =
      '<div class="dense-auth-backdrop" data-dense-auth-close></div>' +
      '<div class="dense-auth-dialog">' +
      '  <h3>Join the private beta</h3>' +
      '  <p>To reply or post here, request access first. This keeps the conversation focused and high-signal.</p>' +
      '  <div class="dense-auth-actions">' +
      '    <button type="button" data-dense-auth-open-access>Request an invitation</button>' +
      '    <button type="button" data-dense-auth-close>Not now</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(wrapper);

    wrapper
      .querySelectorAll('[data-dense-auth-close]')
      .forEach(function (btn) {
        btn.addEventListener('click', function () {
          wrapper.classList.remove('is-open');
        });
      });

    var openAccess = wrapper.querySelector(
      '[data-dense-auth-open-access]'
    );
    if (openAccess) {
      openAccess.addEventListener('click', function () {
        var target =
          document.getElementById('dense-accounts') ||
          document.querySelector('.dense-accounts');
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        wrapper.classList.remove('is-open');
      });
    }

    return wrapper;
  }

  function showAuthModal() {
    var modal = ensureAuthModal();
    if (!modal) return;
    modal.classList.add('is-open');
  }

  function ensureReportToast() {
    var existing = document.querySelector('[data-dense-report-toast]');
    if (existing) return existing;

    var toast = document.createElement('div');
    toast.className = 'dense-report-toast';
    toast.setAttribute('data-dense-report-toast', 'true');
    document.body.appendChild(toast);
    return toast;
  }

  function showReportToast(reason) {
    var toast = ensureReportToast();
    if (!toast) return;
    var label = '';
    if (reason === 'handwavey') {
      label = 'Marked as “handwavey”.';
    } else if (reason === 'confident-no-sources') {
      label = 'Marked as “confident but source-free”.';
    } else if (reason === 'ad-hominem') {
      label = 'Marked as “ad hominem”.';
    } else {
      label = 'Report submitted.';
    }
    toast.textContent =
      label + ' This will be reviewed alongside other reports.';
    toast.classList.add('is-visible');
    try {
      clearTimeout(toast._denseTimeout);
    } catch (e) {
      // ignore
    }
    toast._denseTimeout = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  function initComments() {
    var containers = document.querySelectorAll('.dense-comments');
    if (!containers.length) return;

    containers.forEach(function (container) {
      var comments = container.querySelectorAll('.dense-comment');
      var densities = [];

      comments.forEach(function (comment) {
        var bodyEl = comment.querySelector('.dense-comment-body');
        var stats = textStats(bodyEl ? bodyEl.textContent : '');
        var density = computeDensity(stats);
        comment.dataset.densityScore = String(density);
        comment.dataset.wordCount = String(stats.words);
        densities.push(density);

        var densityLabel = comment.querySelector('.dense-comment-density');
        if (densityLabel) {
          if (density === 0) {
            densityLabel.textContent = 'density: —';
          } else {
            densityLabel.textContent = 'density: ' + density + ' bits / 100w';
          }
        }

        var reportBtn = comment.querySelector(
          '.dense-comment-report-button'
        );
        var reportMenu = comment.querySelector('.dense-report-menu');
        if (reportBtn && reportMenu) {
          reportBtn.addEventListener('click', function () {
            reportMenu.classList.toggle('is-open');
          });
          reportMenu
            .querySelectorAll('button[data-report-reason]')
            .forEach(function (btn) {
              btn.addEventListener('click', function () {
                var reason = btn.getAttribute('data-report-reason');
                var slugAttr =
                  container.getAttribute('data-thread-slug') ||
                  document
                    .querySelector('.dense-multi-part')
                    ?.getAttribute('data-thread-slug') ||
                  location.pathname;
                backendPost('/api/dense/report', {
                  slug: slugAttr,
                  handle: comment.dataset.handle || '',
                  reason: reason,
                });
                reportMenu.classList.remove('is-open');
                showReportToast(reason);
              });
            });
        }
      });

      var densityThreshold = 0;
      if (densities.length) {
        var sorted = densities.slice().sort(function (a, b) {
          return a - b;
        });
        var mid = Math.floor(sorted.length * 0.5); // median
        densityThreshold = sorted[mid] || 0;
      }

      var denseToggle = container.querySelector(
        '.dense-view-toggle button[data-dense-view="dense"]'
      );
      var allToggle = container.querySelector(
        '.dense-view-toggle button[data-dense-view="all"]'
      );

      function isDenseComment(comment) {
        var densityScore = parseFloat(comment.dataset.densityScore || '0');
        var words = parseInt(comment.dataset.wordCount || '0', 10);
        var text = comment.textContent || '';
        var hasLink = /https?:\/\/\S+|\[\d+\]/i.test(text);
        var hasEquation =
          /[=<>]\s*\d|\bO\([\w^]+\)|\bETA\b|\bsum\b|∑|∫|≈|≥|≤/.test(text);

        var passesAbsolute =
          words >= 80 ||
          (hasLink && words >= 40) ||
          hasEquation ||
          densityScore >= 1.5;

        var passesRelative =
          densityThreshold > 0 && densityScore >= densityThreshold;

        return passesAbsolute || passesRelative;
      }

      function applyView(mode) {
        comments.forEach(function (comment) {
          var isDense = isDenseComment(comment);

          if (mode === 'dense' && !isDense) {
            comment.style.display = 'none';
          } else {
            comment.style.display = '';
          }
        });
      }

      if (denseToggle && allToggle) {
        denseToggle.addEventListener('click', function () {
          denseToggle.classList.add('is-active');
          allToggle.classList.remove('is-active');
          applyView('dense');
        });
        allToggle.addEventListener('click', function () {
          allToggle.classList.add('is-active');
          denseToggle.classList.remove('is-active');
          applyView('all');
        });
        applyView('dense');
      }

      comments.forEach(function (comment) {
        var depth = parseInt(comment.dataset.depth || '0', 10);
        var children = comment.querySelector('.dense-comment-children');
        var replyBtn = comment.querySelector('.dense-comment-reply-button');

        if (replyBtn) {
          replyBtn.addEventListener('click', function (e) {
            if (!hasDenseAccount()) {
              e.preventDefault();
              showAuthModal();
            }
          });
        }

        if (children && depth >= 3) {
          var replies = children.querySelectorAll('.dense-comment').length;
          comment.classList.add('dense-thread-collapsed');
          var toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'dense-thread-toggle';
          toggle.textContent =
            'Unroll thread (' + replies + ' repl' + (replies === 1 ? 'y' : 'ies') + ')';
          toggle.addEventListener('click', function () {
            if (comment.classList.contains('dense-thread-collapsed')) {
              comment.classList.remove('dense-thread-collapsed');
              toggle.textContent = 'Collapse thread';
            } else {
              comment.classList.add('dense-thread-collapsed');
              toggle.textContent =
                'Unroll thread (' +
                replies +
                ' repl' +
              (replies === 1 ? 'y' : 'ies') +
                ')';
            }
          });
          comment.appendChild(toggle);
        }
      });

      var listEl = container.querySelector('.dense-comment-list');
      var form = container.querySelector('form[data-dense-comment-form]');
      if (form && listEl) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (!hasDenseAccount()) {
            showAuthModal();
            return;
          }
          var handleField = form.querySelector('input[name="handle"]');
          var bodyField = form.querySelector('textarea[name="comment"]');
          var handle =
            (handleField && handleField.value.trim()) ||
            (window.DENSE_ACTIVE_HANDLE
              ? '@' + window.DENSE_ACTIVE_HANDLE
              : 'anon');
          var text = bodyField ? bodyField.value.trim() : '';
          if (!text) return;

          var li = document.createElement('li');
          li.className = 'dense-comment';
          li.dataset.depth = '0';
          li.dataset.handle = handle;

          var meta = document.createElement('div');
          meta.className = 'dense-comment-meta';
          var handleSpan = document.createElement('span');
          handleSpan.className = 'dense-comment-handle';
          handleSpan.textContent = handle;
          var densitySpan = document.createElement('span');
          densitySpan.className = 'dense-comment-density';
          meta.appendChild(handleSpan);
          meta.appendChild(densitySpan);

          var bodyDiv = document.createElement('div');
          bodyDiv.className = 'dense-comment-body';
          bodyDiv.textContent = text;

          var footer = document.createElement('div');
          footer.className = 'dense-comment-footer';

          li.appendChild(meta);
          li.appendChild(bodyDiv);
          li.appendChild(footer);
          listEl.appendChild(li);

          var stats = textStats(text);
          var density = computeDensity(stats);
          li.dataset.densityScore = String(density);
          li.dataset.wordCount = String(stats.words);
          if (densitySpan) {
            if (density === 0) {
              densitySpan.textContent = 'density: —';
            } else {
              densitySpan.textContent =
                'density: ' + density + ' bits / 100w';
            }
          }

          if (bodyField) bodyField.value = '';

          comments = container.querySelectorAll('.dense-comment');
          if (
            denseToggle &&
            denseToggle.classList.contains('is-active')
          ) {
            applyView('dense');
          } else {
            applyView('all');
          }
          initViewsAndDepth();

          var slugAttr =
            container.getAttribute('data-thread-slug') ||
            document
              .querySelector('.dense-multi-part')
              ?.getAttribute('data-thread-slug') ||
            location.pathname;
          backendPost('/api/dense/comment', {
            slug: slugAttr,
            handle: handle,
            body: text,
            tags: [],
          });
        });
      }
    });
  }

  function initViewsAndDepth() {
    var blocks = document.querySelectorAll('[data-dense-metrics]');
    if (!blocks.length) return;

     blocks.forEach(function (block) {
      var viewsEl = block.querySelector('[data-dense-views-count]');
      if (viewsEl) {
        // Toy heuristic so dense posts feel “lived in” without storing anything locally.
        var count = 300 + Math.floor(Math.random() * 60);
        viewsEl.textContent = count.toLocaleString();
      }

      var depthFill = block.querySelector('[data-dense-depth-fill]');
      var depthText = block.querySelector('[data-dense-depth-text]');
      var comments = document.querySelectorAll('.dense-comment');

      if (!depthFill || !depthText || !comments.length) return;

      var wordCounts = [];
      var linkCount = 0;
      var eqCount = 0;

      comments.forEach(function (c) {
        var stats = textStats(
          (c.querySelector('.dense-comment-body') || c).textContent || ''
        );
        if (stats.words) {
          wordCounts.push(stats.words);
        }
        if (stats.hasLink) linkCount += 1;
        if (stats.hasEquation) eqCount += 1;
      });

      wordCounts.sort(function (a, b) {
        return a - b;
      });
      var medianWords = 0;
      if (wordCounts.length) {
        var mid = Math.floor(wordCounts.length / 2);
        medianWords =
          wordCounts.length % 2
            ? wordCounts[mid]
            : (wordCounts[mid - 1] + wordCounts[mid]) / 2;
      }

      var total = comments.length || 1;
      var sourcesPer10 = (linkCount / total) * 10;
      var eqFraction = eqCount / total;

      var scoreRaw =
        (Math.min(medianWords, 200) / 200) * 40 +
        Math.min(sourcesPer10, 6) * 6 +
        Math.min(eqFraction, 0.8) * 40;
      var baseScore = Math.max(0, Math.min(100, scoreRaw));
      // Map raw 0–100 depth into a narrower 40–80 band
      var mappedScore = 40 + (baseScore / 100) * 40;
      var score = Math.round(mappedScore);

      depthFill.style.width = score + '%';
      depthText.textContent =
        'Depth ' +
        score +
        ' / 100 · median ' +
        Math.round(medianWords) +
        ' words, ' +
        linkCount +
        ' sources, ' +
        Math.round(eqFraction * 100) +
        '% equations/models';
    });
  }

  function initLabChat() {
    var chats = document.querySelectorAll('.dense-lab-chat');
    if (!chats.length) return;

    chats.forEach(function (chat) {
      var slug = chat.getAttribute('data-thread-slug') || location.pathname;
      var messagesEl = chat.querySelector('[data-lab-chat-messages]');
      var form = chat.querySelector('form[data-lab-chat-form]');
      var handleInput = chat.querySelector('input[name="lab_handle"]');
      var textInput = chat.querySelector('textarea[name="lab_message"]');

      var msgs = [];

      function render() {
        if (!messagesEl) return;
        messagesEl.innerHTML = '';
        msgs
          .sort(function (a, b) {
            return a.at - b.at;
          })
          .forEach(function (m) {
            var item = document.createElement('div');
            item.className = 'dense-lab-message';
            var meta = document.createElement('div');
            meta.className = 'dense-lab-meta';
            meta.textContent =
              (m.handle || 'anon') +
              ' · ' +
              new Date(m.at).toLocaleString();
            var body = document.createElement('div');
            body.className = 'dense-lab-body';
            body.textContent = m.text;
            item.appendChild(meta);
            item.appendChild(body);
            messagesEl.appendChild(item);
          });
      }

      render();

      if (form && textInput) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var handle = (handleInput && handleInput.value.trim()) || 'anon';
          var text = textInput.value.trim();
          if (!text) return;
          msgs.push({
            handle: handle,
            text: text,
            at: Date.now(),
          });
          textInput.value = '';
          render();
        });
      }
    });
  }

  function initAnnotations() {
    var blocks = document.querySelectorAll('.dense-annotations');
    if (!blocks.length) return;

    blocks.forEach(function (block) {
      var slug =
        block.getAttribute('data-thread-slug') || location.pathname;
      var key = 'dense-annotations:' + slug;

      var listEl = block.querySelector('.dense-annotation-list');
      var toggleInput = block.querySelector(
        'input[data-annotations-toggle]'
      );
      var quoteInput = block.querySelector(
        'input[name="annotation_quote"]'
      );
      var noteInput = block.querySelector(
        'textarea[name="annotation_note"]'
      );
      var form = block.querySelector('form.dense-annotation-form');

      var storedAnnotations = [];

      function render(show) {
        if (!listEl) return;
        listEl.innerHTML = '';
        if (!show) return;
        var dataAttr = block.getAttribute('data-pinned-annotations');
        var pinned = [];
        if (dataAttr) {
          try {
            pinned = JSON.parse(dataAttr);
          } catch (e) {
            pinned = [];
          }
        }
        if (!Array.isArray(pinned)) {
          pinned = [];
        }
        var items = pinned.concat(storedAnnotations);
        items.forEach(function (item) {
          var li = document.createElement('li');
          li.className = 'dense-annotation-item';
          var quote = document.createElement('div');
          quote.className = 'dense-annotation-quote';
          quote.textContent = '“' + (item.quote || '').trim() + '”';
          var note = document.createElement('div');
          note.className = 'dense-annotation-note';
          note.textContent = item.note || '';
          var meta = document.createElement('div');
          meta.className = 'dense-annotation-meta';
          meta.textContent =
            (item.pinned ? 'Pinned · ' : '') +
            (item.handle || 'anon');
          li.appendChild(quote);
          li.appendChild(note);
          li.appendChild(meta);
          listEl.appendChild(li);
        });
      }

      if (toggleInput) {
        toggleInput.addEventListener('change', function () {
          render(toggleInput.checked);
        });
        render(toggleInput.checked);
      }

      if (form && quoteInput && noteInput) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var quote = quoteInput.value.trim();
          var note = noteInput.value.trim();
          if (!quote || !note) return;
          storedAnnotations.push({
            quote: quote,
            note: note,
            handle: 'reader',
            pinned: false,
          });
          quoteInput.value = '';
          noteInput.value = '';
          if (toggleInput && toggleInput.checked) {
            render(true);
          }
        });
      }
    });
  }

  function initAccounts() {
    var blocks = document.querySelectorAll('.dense-accounts');
    if (!blocks.length) return;

    blocks.forEach(function (block) {
      var inviteForm = block.querySelector('form[data-dense-invite-form]');
      var inviteNameInput = block.querySelector(
        'input[name="dense_invite_name"]'
      );
      var inviteEmailInput = block.querySelector(
        'input[name="dense_invite_email"]'
      );
      var inviteFocusInput = block.querySelector(
        'textarea[name="dense_invite_focus"]'
      );
      var inviteLinksInput = block.querySelector(
        'textarea[name="dense_invite_links"]'
      );
      var inviteStatus = block.querySelector('.dense-invite-status');
      var loginForm = block.querySelector('form[data-dense-login-form]');
      var emailInput = block.querySelector('input[name="dense_email"]');
      var profile = block.querySelector('[data-dense-profile]');
      var handleInput = block.querySelector('input[name="dense_handle"]');
      var bioInput = block.querySelector('input[name="dense_bio"]');
      var statusInput = block.querySelector(
        'input[name="dense_status"]'
      );
      var linksInput = block.querySelector(
        'textarea[name="dense_links"]'
      );
      var saveBtn = block.querySelector('button[data-dense-profile-save]');
      var summary = block.querySelector('.dense-profile-summary');
      var deltaList = block.querySelector('.dense-delta-list');
      var deltaForm = block.querySelector('form.dense-delta-form');
      var deltaTopicInput = block.querySelector(
        'input[name="dense_delta_topic"]'
      );
      var deltaNoteInput = block.querySelector(
        'textarea[name="dense_delta_note"]'
      );

      function load() {
        return DENSE_ACCOUNT || null;
      }

      function save(data) {
        DENSE_ACCOUNT = data || null;
        safeWrite('dense-account', data || {});
        try {
          window.DENSE_ACCOUNT_EMAIL = data && data.email ? data.email : '';
          window.DENSE_ACTIVE_HANDLE = data && data.handle ? data.handle : '';
        } catch (e) {
          // ignore
        }
        if (data && (data.email || (data.invite && data.invite.email))) {
          backendPost('/api/dense/account', {
            email: data.email || (data.invite && data.invite.email) || '',
            handle: data.handle || '',
            bio: data.bio || '',
            status: data.status || '',
            links: Array.isArray(data.links) ? data.links : [],
            invite: data.invite || null,
          });
        }
      }

      function renderShell(data) {
        var hasInvite = !!(data && data.invite && data.invite.email);

        if (inviteForm) {
          if (data && data.invite) {
            if (inviteNameInput) {
              inviteNameInput.value = data.invite.name || '';
            }
            if (inviteEmailInput) {
              inviteEmailInput.value = data.invite.email || '';
            }
            if (inviteFocusInput) {
              inviteFocusInput.value = data.invite.focus || '';
            }
            if (inviteLinksInput) {
              inviteLinksInput.value = (data.invite.links || []).join(', ');
            }
          }
        }

        if (loginForm) {
          loginForm.hidden = !hasInvite;
        }

        if (inviteStatus) {
          if (hasInvite) {
            inviteStatus.textContent =
              'Request sent! You should expect receiving an email from Simon in 7 days.';
          } else {
            inviteStatus.textContent = '';
          }
        }

        if (emailInput && data && data.email) {
          emailInput.value = data.email;
        }
      }

      function renderProfile(data) {
        if (!profile || !summary) return;
        profile.hidden = !data;
        if (!data) {
          summary.textContent = '';
          if (deltaList) deltaList.innerHTML = '';
          return;
        }
        if (handleInput) handleInput.value = data.handle || '';
        if (bioInput) bioInput.value = data.bio || '';
        if (statusInput) statusInput.value = data.status || '';
        if (linksInput) linksInput.value = (data.links || []).join(', ');
        var parts = [];
        if (data.handle) parts.push('@' + data.handle);
        if (data.bio) parts.push('"' + data.bio + '"');
        if (data.status) parts.push('Working on: ' + data.status);
        if (data.links && data.links.length) {
          parts.push('Links: ' + data.links.join(', '));
        }
        summary.textContent = parts.join(' · ');
        window.DENSE_ACTIVE_HANDLE = data.handle || null;

        if (deltaList) {
          deltaList.innerHTML = '';
          var deltas = (data.deltas && Array.isArray(data.deltas))
            ? data.deltas.slice()
            : [];
          deltas
            .sort(function (a, b) {
              return (b.at || 0) - (a.at || 0);
            })
            .forEach(function (d) {
              var li = document.createElement('li');
              li.className = 'dense-delta-item';
              var line = d.topic || 'Changed mind';
              if (d.note) {
                line += ' — ' + d.note;
              }
              if (d.at) {
                line +=
                  ' · ' + new Date(d.at).toLocaleDateString();
              }
              li.textContent = line;
              deltaList.appendChild(li);
            });
        }
      }

      var existing = load();
      if (existing) {
        renderShell(existing);
        renderProfile(existing);
      } else {
        renderShell(null);
      }

      if (inviteForm && inviteEmailInput && inviteFocusInput) {
        inviteForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var name =
            (inviteNameInput && inviteNameInput.value.trim()) || '';
          var email = inviteEmailInput.value.trim();
          var focus = inviteFocusInput.value.trim();
          var linksRaw =
            (inviteLinksInput && inviteLinksInput.value.trim()) || '';
          if (!email || !focus) return;

          var data =
            existing ||
            {
              email: '',
              handle: '',
              bio: '',
              status: '',
              links: [],
              deltas: [],
            };
          data.invite = {
            name: name,
            email: email,
            focus: focus,
            links: linksRaw
              ? linksRaw.split(',').map(function (s) {
                  return s.trim();
                })
              : [],
            at: Date.now(),
          };
          if (!data.email) {
            data.email = email;
          }
          save(data);
          existing = data;
          renderShell(existing);
          if (inviteStatus) {
            inviteStatus.textContent =
              'Request sent! You should expect receiving an email from Simon in 7 days.';
          }
          try {
            alert(
              'Request sent! You should expect receiving an email from Simon in 7 days.'
            );
          } catch (e) {
            // ignore
          }
        });
      }

      if (loginForm && emailInput) {
        loginForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var email = emailInput.value.trim();
          if (!email) return;
          var data =
            existing ||
            {
              email: email,
              handle: '',
              bio: '',
              status: '',
              links: [],
            };
          data.email = email;
          save(data);
          existing = data;
          renderShell(existing);
          renderProfile(existing);
        });
      }

      if (saveBtn && profile) {
        saveBtn.addEventListener('click', function () {
          var data = existing || {};
          data.handle = (handleInput && handleInput.value.trim()) || '';
          data.bio = (bioInput && bioInput.value.trim()) || '';
          data.status = (statusInput && statusInput.value.trim()) || '';
          var linksRaw = (linksInput && linksInput.value.trim()) || '';
          data.links = linksRaw
            ? linksRaw.split(',').map(function (s) {
                return s.trim();
              })
            : [];
          if (!Array.isArray(data.deltas)) {
            data.deltas = [];
          }
          save(data);
          existing = data;
          renderProfile(existing);
        });
      }

      if (deltaForm && deltaTopicInput && deltaNoteInput) {
        deltaForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var topic = deltaTopicInput.value.trim();
          var note = deltaNoteInput.value.trim();
          if (!topic && !note) return;
          var data = existing || {
            email: '',
            handle: '',
            bio: '',
            status: '',
            links: [],
            deltas: [],
          };
          if (!Array.isArray(data.deltas)) {
            data.deltas = [];
          }
          data.deltas.push({
            topic: topic || 'Changed mind',
            note: note,
            at: Date.now(),
          });
          save(data);
          existing = data;
          deltaTopicInput.value = '';
          deltaNoteInput.value = '';
         renderProfile(existing);
        });
      }
    });
  }

  function initEmailFeeds() {
    var blocks = document.querySelectorAll('.dense-email-feeds');
    if (!blocks.length) return;

    blocks.forEach(function (block) {
      var emailInput = block.querySelector(
        'input[name="dense_feed_email"]'
      );
      var denseCheckbox = block.querySelector(
        'input[name="dense_feed_dense"]'
      );
      var changelogCheckbox = block.querySelector(
        'input[name="dense_feed_changelog"]'
      );
      var submitBtn = block.querySelector(
        'button[data-dense-feed-submit]'
      );
      var status = block.querySelector('.dense-email-status');

      if (!submitBtn || !emailInput) return;

      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var email = emailInput.value.trim();
        if (!email) return;
        var prefs = {
          dense: denseCheckbox ? denseCheckbox.checked : false,
          changelog: changelogCheckbox
            ? changelogCheckbox.checked
            : false,
        };
        if (status) {
          status.textContent =
            'Preferences noted for this session.';
        }
      });
    });
  }

  function onReady() {
    initShowMultiPart();
    initComments();
    initViewsAndDepth();
    initLabChat();
    initAnnotations();
    initAccounts();
    initEmailFeeds();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
