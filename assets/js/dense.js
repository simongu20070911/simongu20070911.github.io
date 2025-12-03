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
                try {
                  var key =
                    'dense-report:' +
                    (location.pathname || '') +
                    ':' +
                    (comment.dataset.handle || '');
                  var payload = {
                    at: Date.now(),
                    reason: reason,
                  };
                  localStorage.setItem(key, JSON.stringify(payload));
                } catch (e) {
                  // ignore storage failures
                }
                reportMenu.classList.remove('is-open');
              });
            });
        }
      });

      var denseToggle = container.querySelector(
        '.dense-view-toggle button[data-dense-view="dense"]'
      );
      var allToggle = container.querySelector(
        '.dense-view-toggle button[data-dense-view="all"]'
      );

      function applyView(mode) {
        comments.forEach(function (comment) {
          var densityScore = parseFloat(
            comment.dataset.densityScore || '0'
          );
          var words = parseInt(comment.dataset.wordCount || '0', 10);
          var hasLink =
            /https?:\/\/\S+|\[\d+\]/i.test(
              comment.textContent || ''
            );
          var hasEquation =
            /[=<>]\s*\d|\bO\([\w^]+\)|\bETA\b|\bsum\b|∑|∫|≈|≥|≤/.test(
              comment.textContent || ''
            );

          var isDense =
            densityScore >= 1.2 ||
            words >= 80 ||
            (hasLink && words >= 40) ||
            hasEquation;

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
        });
      }
    });
  }

  function initViewsAndDepth() {
    var blocks = document.querySelectorAll('[data-dense-metrics]');
    if (!blocks.length) return;

    var path = location.pathname || '';
    var viewsKey = 'dense-views:' + path;

    blocks.forEach(function (block) {
      var viewsEl = block.querySelector('[data-dense-views-count]');
      if (viewsEl) {
        var count = 0;
        try {
          var raw = localStorage.getItem(viewsKey);
          count = raw ? parseInt(raw, 10) || 0 : 0;
          count += 1;
          localStorage.setItem(viewsKey, String(count));
        } catch (e) {
          count = 1;
        }
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
      var score = Math.round(Math.max(0, Math.min(100, scoreRaw)));

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
      var key = 'dense-lab-chat:' + slug;

      var messagesEl = chat.querySelector('[data-lab-chat-messages]');
      var form = chat.querySelector('form[data-lab-chat-form]');
      var handleInput = chat.querySelector('input[name="lab_handle"]');
      var textInput = chat.querySelector('textarea[name="lab_message"]');

      function loadMessages() {
        try {
          var raw = localStorage.getItem(key);
          if (!raw) return [];
          var parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) return [];
          var weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          return parsed.filter(function (m) {
            return m.at && m.at >= weekAgo && m.text;
          });
        } catch (e) {
          return [];
        }
      }

      function saveMessages(list) {
        try {
          localStorage.setItem(key, JSON.stringify(list));
        } catch (e) {
          // ignore
        }
      }

      function render() {
        if (!messagesEl) return;
        var msgs = loadMessages();
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
          var msgs = loadMessages();
          msgs.push({
            handle: handle,
            text: text,
            at: Date.now(),
          });
          saveMessages(msgs);
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

      function loadAnnotations() {
        try {
          var raw = localStorage.getItem(key);
          if (!raw) return [];
          var parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      }

      function saveAnnotations(items) {
        try {
          localStorage.setItem(key, JSON.stringify(items));
        } catch (e) {
          // ignore
        }
      }

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
        var items = pinned.concat(loadAnnotations());
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
          var items = loadAnnotations();
          items.push({
            quote: quote,
            note: note,
            handle: 'reader',
            pinned: false,
          });
          saveAnnotations(items);
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
      var key = 'dense-account';
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
        try {
          var raw = localStorage.getItem(key);
          if (!raw) return null;
          return JSON.parse(raw);
        } catch (e) {
          return null;
        }
      }

      function save(data) {
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
          // ignore
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
        renderProfile(existing);
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
        try {
          localStorage.setItem(
            'dense-email-feed',
            JSON.stringify({
              email: email,
              prefs: prefs,
              at: Date.now(),
            })
          );
        } catch (e) {
          // ignore
        }
        if (status) {
          status.textContent =
            'Preferences saved locally. In a live deployment this would send a magic-link-style confirmation.';
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
