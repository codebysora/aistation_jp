/**
 * AIStation Dashboard - Redesign Common JS
 */

/* ============================================
   HTML escape helper (XSS prevention)
   ============================================ */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================
   Clipboard copy
   ============================================ */
function initCopyButtons() {
  var cpytxt = $('.cpytext');
  cpytxt.append('<button class="cpybtn" title="Copy"><i class="bi bi-copy"></i></button>');
  $(document).on('click', '.cpybtn', function () {
    var $btn = $(this);
    var text = $btn.parent().clone().children('button, span.balloon_top').remove().end().text().trim();
    var $parent = $btn.parent();
    navigator.clipboard.writeText(text).then(function () {
      $parent.prepend('<span class="balloon_top">Copied!</span>');
      setTimeout(function () { $parent.find('span.balloon_top').remove(); }, 1200);
    }).catch(function () {
      // clipboard write failed — silently ignore
    });
  });
}

/* ============================================
   Table formatters - Keys page
   ============================================ */
function keysActionFormatter(value, row, index) {
  return '<button type="button" class="btn btn-link rd-link-danger p-1 js-delete-key"' +
    ' data-key-id="' + escapeHtml(row.key_id) + '"' +
    ' data-key-masked="' + escapeHtml(row.key_masked) + '">' +
    '<i class="bi bi-x-circle me-1"></i>Remove</button>';
}

function setDeleteTarget(key_id, key_masked) {
  $('#key-delete-key-id').val(key_id);
  $('#key-delete-key-masked').text(key_masked);
}

/* ============================================
   Table formatters - Teams page (user view)
   ============================================ */
function myTeamRoleFormatter(value, row) {
  if (row.team_role === 'owner') {
    return '<span class="badge bg-primary">Owner</span>';
  }
  return '<span class="badge bg-info text-dark">Member</span>';
}

function myTeamActionFormatter(value, row) {
  var addkey = '<button type="button" class="btn btn-dark btn-sm rounded-pill d-inline-flex align-items-center gap-1 c-add-key js-add-key"' +
    ' data-team-id="' + escapeHtml(row.team_id) + '"' +
    ' data-team-name="' + escapeHtml(row.team_name) + '">' +
    '<i class="bi bi-key" aria-hidden="true"></i> Add Key</button>';
  if (row.team_role === 'owner') {
    return addkey +
      ' <a href="./userRole_teams_edit_for_owner.html?team_id=' + encodeURIComponent(row.team_id) + '"' +
      ' class="btn btn-link rd-link-action text-dark p-1">' +
      '<i class="bi bi-pencil-square me-1" aria-hidden="true"></i>Edit</a>';
  }
  return addkey;
}

function setKeyNewTarget(team_id, team_name) {
  $('#key-new-team-id').val(team_id);
  $('#key-new-team-name').text(team_name);
}

/* ============================================
   Table formatters - Team management (admin)
   ============================================ */
function teamActionFormatter(value, row) {
  var addkey = '<button type="button" class="btn btn-dark btn-sm rounded-pill d-inline-flex align-items-center gap-1 c-add-key js-add-key"' +
    ' data-team-id="' + escapeHtml(row.team_id) + '"' +
    ' data-team-name="' + escapeHtml(row.team_name) + '">' +
    '<i class="bi bi-key" aria-hidden="true"></i> Add Key</button>';
  if (row.team_name === 'default') {
    return addkey + ' <span class="text-muted">-</span>';
  }
  return addkey +
    ' <button type="button" class="btn btn-link rd-link-action text-dark p-1 js-edit-team"' +
    ' data-team-id="' + escapeHtml(row.team_id) + '">' +
    '<i class="bi bi-pencil-square me-1" aria-hidden="true"></i>Edit</button>';
}

/* ============================================
   Table formatters - Models
   ============================================ */
function modelStatusFormatter(value) {
  if (value === 'Active') {
    return '<span class="c-model-status--active">Active</span>';
  }
  return '<span class="c-model-status--failed">' + escapeHtml(value) + '</span>';
}

function modelRemoveFormatter(value, row) {
  return '<button type="button" class="btn btn-link rd-link-danger p-0 border-0 js-remove-model">' +
    '<i class="bi bi-x-circle me-1"></i>Remove</button>';
}

/* ============================================
   Table formatters - User management (admin)
   ============================================ */
function roleFormatter(value, row) {
  if (row.role === 'admin') {
    return '<span class="badge bg-primary">Admin</span>';
  }
  return '<span class="badge bg-info text-dark">User</span>';
}

function userActionFormatter(value, row) {
  return '<button type="button" class="btn btn-link rd-link-action text-dark p-1 js-edit-user"' +
    ' data-user-id="' + escapeHtml(row.user_id) + '">' +
    '<i class="bi bi-pencil-square me-1" aria-hidden="true"></i>Edit</button>';
}

/* ============================================
   Table formatters - Members table (team edit)
   ============================================ */
function memberRemoveFormatter(value, row) {
  return '<button type="button" class="btn btn-link rd-link-danger p-1 js-remove-member"' +
    ' data-user-id="' + escapeHtml(row.user_id) + '">' +
    '<i class="bi bi-x-circle me-1"></i>Remove</button>';
}

/* ============================================
   Table formatters - Member add dropdown
   ============================================ */
function memberAddFormatter(value, row) {
  return '<button type="button" class="btn btn-link text-dark p-1 js-add-member"' +
    ' data-user-id="' + escapeHtml(row.user_id) + '"' +
    ' data-email="' + escapeHtml(row.email) + '">' +
    '<i class="bi bi-plus-circle me-1"></i>Add</button>';
}

/* ============================================
   Table formatters - User edit
   ============================================ */
function teamRoleFormatter(value, row) {
  if (row.team_role === 'owner') {
    return '<span class="badge bg-primary">Owner</span>';
  } else if (row.team_role === 'member') {
    return '<span class="badge bg-info text-dark">Member</span>';
  }
  return '';
}

function userTeamActionFormatter(value, row) {
  if (row.team_name === 'default') {
    return '<span class="text-muted">-</span>';
  }
  if (row.team_role === 'owner') {
    return '<span class="d-flex align-items-center gap-2">' +
      '<button type="button" class="btn btn-dark btn-sm d-inline-flex align-items-center gap-1 rounded-1 js-set-team-role"' +
      ' data-team-id="' + escapeHtml(row.team_id) + '" data-team-role="member">' +
      '<i class="bi bi-person-fill"></i> Member <i class="bi bi-plus-circle"></i></button>' +
      '<button type="button" class="btn btn-link rd-link-danger p-1 js-set-team-role"' +
      ' data-team-id="' + escapeHtml(row.team_id) + '" data-team-role="-">' +
      '<i class="bi bi-x-circle me-1"></i>Remove</button></span>';
  } else if (row.team_role === 'member') {
    return '<span class="d-flex align-items-center gap-2">' +
      '<button type="button" class="btn btn-dark btn-sm d-inline-flex align-items-center gap-1 rounded-1 js-set-team-role"' +
      ' data-team-id="' + escapeHtml(row.team_id) + '" data-team-role="owner">' +
      '<i class="bi bi-person-circle"></i> Owner <i class="bi bi-plus-circle"></i></button>' +
      '<button type="button" class="btn btn-link rd-link-danger p-1 js-set-team-role"' +
      ' data-team-id="' + escapeHtml(row.team_id) + '" data-team-role="-">' +
      '<i class="bi bi-x-circle me-1"></i>Remove</button></span>';
  }
  return '<span class="d-flex align-items-center gap-2">' +
    '<button type="button" class="btn btn-dark btn-sm d-inline-flex align-items-center gap-1 rounded-1 js-set-team-role"' +
    ' data-team-id="' + escapeHtml(row.team_id) + '" data-team-role="owner">' +
    '<i class="bi bi-person-circle"></i> Owner <i class="bi bi-plus-circle"></i></button>' +
    '<button type="button" class="btn btn-dark btn-sm d-inline-flex align-items-center gap-1 rounded-1 js-set-team-role"' +
    ' data-team-id="' + escapeHtml(row.team_id) + '" data-team-role="member">' +
    '<i class="bi bi-person-fill"></i> Member <i class="bi bi-plus-circle"></i></button></span>';
}

function setTeamRoleTarget(team_id, team_role) {
  $('#role-team-id').val(team_id);
  $('#role-team-role').val(team_role);
}

/* ============================================
   Table formatters - Histories
   ============================================ */
function historyStatusFormatter(value) {
  if (value === 'success') {
    return '<span class="c-model-status--active">success</span>';
  }
  if (value === 'failure') {
    return '<span class="c-model-status--failed">failure</span>';
  }
  return escapeHtml(value || '-');
}

function historyTimeFormatter(value) {
  if (!value) return '-';
  // Trim microseconds for readability: "2026-04-10 05:45:59.724000" -> "2026-04-10 05:45:59"
  return escapeHtml(String(value).replace(/\.\d+$/, ''));
}

function historyNumberFormatter(value) {
  if (value == null) return '-';
  return Number(value).toLocaleString();
}

function historyRequestIdFormatter(value) {
  if (!value) return '-';
  var v = String(value);
  var short = v.length > 16 ? v.slice(0, 16) + '…' : v;
  return '<span class="text-body-secondary" title="' + escapeHtml(v) + '">' + escapeHtml(short) + '</span>';
}

/** Admin histories table: merge bootstrap-table params with search form values for server requests. */
function adminHistoriesQueryParams(params) {
  return {
    search: params.search,
    sort: params.sort,
    order: params.order,
    offset: params.offset,
    limit: params.limit,
    username: $('#histories-search-username').val() || '',
    date_from: $('#histories-search-date-from').val() || '',
    date_to: $('#histories-search-date-to').val() || ''
  };
}

function initAdminHistoriesSearch() {
  var $form = $('#histories-search-form');
  var $table = $('#admin-histories-table');
  if (!$form.length || !$table.length) return;
  $form.on('submit', function (e) {
    e.preventDefault();
    $table.bootstrapTable('refresh');
  });
}

function formatLatency(e2el) {
  if (!e2el) return '-';
  var m = String(e2el).match(/^(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return String(e2el);
  var s = parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseFloat(m[3]);
  return s.toFixed(2) + 's';
}

function buildHistorySummary(row) {
  var statusBadge = row.status === 'success'
    ? '<span class="c-model-status--active">success</span>'
    : '<span class="c-model-status--failed">' + escapeHtml(row.status || '-') + '</span>';
  var time = String(row.start_time || '').replace(/\.\d+$/, '');
  var prompt = Number(row.prompt_tokens || 0).toLocaleString();
  var completion = Number(row.completion_tokens || 0).toLocaleString();
  return statusBadge +
    '<span class="badge bg-light text-dark border fw-normal">' + escapeHtml(time || '-') + '</span>' +
    '<span class="badge bg-light text-dark border fw-normal">Latency: ' + escapeHtml(formatLatency(row.e2el)) + '</span>' +
    '<span class="badge bg-light text-dark border fw-normal">Model: ' + escapeHtml(row.model || '-') + '</span>' +
    '<span class="badge bg-light text-dark border fw-normal">' + prompt + ' prompt &rarr; ' + completion + ' completion</span>';
}

function buildHistorySection(title, bodyHtml, opts) {
  opts = opts || {};
  var titleClass = 'rd-history-section__title' + (opts.danger ? ' rd-history-section__title--danger' : '');
  return '<section class="rd-history-section">' +
    '<div class="' + titleClass + '">' + escapeHtml(title) + '</div>' +
    bodyHtml +
    '</section>';
}

function buildHistoryKvTable(obj) {
  var keys = Object.keys(obj || {});
  if (!keys.length) return '<div class="text-body-secondary small">empty</div>';
  var html = '<table class="rd-history-kv">' +
    '<thead><tr><th style="width:30%">Path</th><th>Value</th></tr></thead>' +
    '<tbody>';
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var v = obj[k];
    var rendered;
    if (v == null) {
      rendered = '<span class="text-body-secondary">null</span>';
    } else if (typeof v === 'string') {
      rendered = '<pre>' + escapeHtml(v) + '</pre>';
    } else {
      rendered = '<pre>' + escapeHtml(JSON.stringify(v, null, 2)) + '</pre>';
    }
    html += '<tr>' +
      '<td class="rd-history-kv__key">' + escapeHtml(k) + '</td>' +
      '<td class="rd-history-kv__value">' + rendered + '</td>' +
      '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

function historyMsgRoleClass(role) {
  if (role === 'system') return 'rd-history-msg rd-history-msg--system';
  if (role === 'user') return 'rd-history-msg rd-history-msg--user';
  if (role === 'assistant') return 'rd-history-msg rd-history-msg--assistant';
  return 'rd-history-msg';
}

/** OpenAI multimodal APIs may return message content as an array of parts, not a plain string. */
function formatHistoryMessageContent(content) {
  if (content == null) return '';
  if (Array.isArray(content) || (typeof content === 'object')) {
    try {
      return escapeHtml(JSON.stringify(content, null, 2));
    } catch (e) {
      return escapeHtml(String(content));
    }
  }
  return escapeHtml(String(content));
}

function buildHistoryErrorDisplay(err, showTraceback) {
  if (!err || typeof err !== 'object') return err;
  if (showTraceback) return err;
  var filtered = {};
  var keys = Object.keys(err);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] !== 'traceback') {
      filtered[keys[i]] = err[keys[i]];
    }
  }
  return filtered;
}

function buildHistoryPreview(row, options) {
  options = options || {};
  var showMetadata = options.showMetadata !== false;
  var showTraceback = options.showTraceback !== false;
  var html = '';

  // Tags
  var tags = row.request_tags || [];
  if (tags.length) {
    var tagsHtml = '<div class="d-flex flex-wrap gap-2">';
    for (var i = 0; i < tags.length; i++) {
      tagsHtml += '<span class="badge bg-light text-dark border fw-normal">' + escapeHtml(tags[i]) + '</span>';
    }
    tagsHtml += '</div>';
    html += buildHistorySection('Tags', tagsHtml);
  }

  // Input messages (proxy_server_request.messages)
  var msgs = (row.proxy_server_request && row.proxy_server_request.messages) || [];
  if (msgs.length) {
    var inputHtml = '';
    for (var j = 0; j < msgs.length; j++) {
      var m = msgs[j] || {};
      inputHtml += '<div class="' + historyMsgRoleClass(m.role) + '">' +
        '<div class="rd-history-msg__role">' + escapeHtml(m.role || '-') + '</div>' +
        '<pre class="rd-history-msg__content">' + formatHistoryMessageContent(m.content) + '</pre>' +
        '</div>';
    }
    html += buildHistorySection('Input', inputHtml);
  }

  // Output (response.choices[*].message)
  var choices = (row.response && row.response.choices) || [];
  if (choices.length) {
    var outHtml = '';
    for (var k = 0; k < choices.length; k++) {
      var msgA = (choices[k] || {}).message || {};
      outHtml += buildHistoryKvTable(msgA);
    }
    html += buildHistorySection('Output', outHtml);
  }

  // Error info (failure cases)
  var err = row.metadata_ && row.metadata_.error_information;
  if (err) {
    var errDisplay = buildHistoryErrorDisplay(err, showTraceback);
    if (Object.keys(errDisplay).length) {
      html += buildHistorySection('Error', buildHistoryKvTable(errDisplay), { danger: true });
    }
  }

  // Metadata (admin only)
  if (showMetadata && row.metadata_) {
    var metaHtml = '<pre class="rd-history-meta">' +
      escapeHtml(JSON.stringify(row.metadata_, null, 2)) +
      '</pre>';
    html += buildHistorySection('Metadata', metaHtml);
  }

  if (!html) {
    html = '<div class="text-body-secondary">No preview content.</div>';
  }
  return html;
}

function showAdminHistoryDetail(row) {
  $('#admin-history-detail-modal-label').text(row.request_id || 'Request Detail');
  $('#admin-history-detail-summary').html(buildHistorySummary(row));
  $('#admin-history-detail-preview').html(buildHistoryPreview(row, {
    showMetadata: true,
    showTraceback: true
  }));

  var json;
  try { json = JSON.stringify(row, null, 2); } catch (e) { json = String(row); }
  $('#admin-history-detail-json').text(json);

  var trigger = document.getElementById('admin-history-tab-preview-trigger');
  if (trigger) {
    bootstrap.Tab.getOrCreateInstance(trigger).show();
  }

  var modalEl = document.getElementById('admin-history-detail-modal');
  if (modalEl) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}

function showMyHistoryDetail(row) {
  $('#myhistory-detail-modal-label').text(row.request_id || 'Request Detail');
  $('#myhistory-detail-summary').html(buildHistorySummary(row));
  $('#myhistory-detail-preview').html(buildHistoryPreview(row, {
    showMetadata: false,
    showTraceback: false
  }));

  var modalEl = document.getElementById('myhistory-detail-modal');
  if (modalEl) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}


/* ============================================
   Model detail modal
   ============================================ */
function buildModelDetailHtml(data) {
  var statusClass = data.status === 'Active' ? 'c-model-status--active' : 'c-model-status--failed';
  var params = '';
  try { params = JSON.stringify(JSON.parse(data.parameters || '{}'), null, 2); } catch (e) { params = data.parameters || '-'; }

  var fields = [
    { label: 'Status',      value: '<span class="' + statusClass + '">' + escapeHtml(data.status) + '</span>', raw: true },
    { label: 'Model Name',  value: data.model_name },
    { label: 'Model Source', value: data.model_source },
    { label: 'Engine',      value: data.engine },
    { label: 'Version',     value: data.version },
    { label: 'API Base',    value: data.api_base },
    { label: 'CPU Count',   value: data.cpu_count },
    { label: 'CPU Memory (GB)', value: data.cpu_memory },
    { label: 'Parameters',  value: params, pre: true }
  ];

  var html = '<dl class="row mb-0 mt-3">';
  for (var i = 0; i < fields.length; i++) {
    var f = fields[i];
    var val = f.value || '-';
    html += '<dt class="col-sm-4 py-2 text-body-secondary" style="font-weight:500">' + escapeHtml(f.label) + '</dt>';
    html += '<dd class="col-sm-8 py-2 mb-0">';
    if (f.pre) {
      html += '<pre class="mb-0 small bg-light rounded p-2">' + escapeHtml(val) + '</pre>';
    } else if (f.raw) {
      html += val;
    } else {
      html += escapeHtml(val);
    }
    html += '</dd>';
  }
  html += '</dl>';
  return html;
}

function showModelDetail(data) {
  $('#model-detail-modal-label').text(data.model_name || 'Model Detail');
  $('#model-detail-body').html(buildModelDetailHtml(data));
  var modal = new bootstrap.Modal(document.getElementById('model-detail-modal'));
  modal.show();
}

/* ============================================
   Event delegation (replaces inline onclick)
   ============================================ */
function initEventDelegation() {
  // Keys page - delete key (open modal)
  var deleteKeyId = null;
  $(document).on('click', '.js-delete-key', function () {
    var $el = $(this);
    deleteKeyId = $el.data('key-id');
    setDeleteTarget(deleteKeyId, $el.data('key-masked'));
    var modal = new bootstrap.Modal(document.getElementById('key-delete-modal'));
    modal.show();
  });

  // Keys page - delete key (submit → loading → fade out → remove row → toast)
  $(document).on('submit', '#key-delete-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');
    setButtonLoading($btn, true);

    setTimeout(function () {
      var modal = bootstrap.Modal.getInstance(document.getElementById('key-delete-modal'));
      modal.hide();
      setButtonLoading($btn, false);

      if (deleteKeyId) {
        var id = deleteKeyId;
        deleteKeyId = null;
        var $row = $('#keys-table tbody tr').filter(function () {
          return $(this).find('[data-key-id="' + id + '"]').length > 0 ||
                 $(this).attr('data-uniqueid') === id;
        });
        $row.css({
          'transition': 'opacity 0.5s, transform 0.5s',
          'opacity': '0',
          'transform': 'translateX(30px)'
        });
        setTimeout(function () {
          $('#keys-table').bootstrapTable('removeByUniqueId', id);
          showToast('API key deleted successfully', 'success');
        }, 500);
      }
    }, 600);
  });

  // Teams page - edit team (admin)
  $(document).on('click', '.js-edit-team', function () {
    location.href = './team_edit.html?team_id=' + encodeURIComponent($(this).data('team-id'));
  });

  // User management - edit user (admin)
  $(document).on('click', '.js-edit-user', function () {
    location.href = './user_edit.html?user_id=' + encodeURIComponent($(this).data('user-id'));
  });

  // Teams page - add key (open modal)
  $(document).on('click', '.js-add-key', function () {
    var $el = $(this);
    setKeyNewTarget($el.data('team-id'), $el.data('team-name'));
    var modal = new bootstrap.Modal(document.getElementById('key-new-modal'));
    modal.show();
  });

  // User edit - set team role and submit
  $(document).on('click', '.js-set-team-role', function () {
    var $el = $(this);
    setTeamRoleTarget($el.data('team-id'), $el.data('team-role'));
    $el.closest('form').submit();
  });

  // Back navigation buttons
  $(document).on('click', '.js-back-to-user-list', function () {
    location.href = './user_management.html';
  });
  $(document).on('click', '.js-back-to-model-select', function () {
    location.href = './deploy_model_select.html';
  });

  // Model settings - manual refresh
  $(document).on('click', '.js-manual-refresh', function (e) {
    e.preventDefault();
    $('#model-settings-table').bootstrapTable('refresh');
  });

  // Model detail - bootstrap-table row click (admin & user)
 $('#model-settings-table, #models-table').on('click-row.bs.table', function (e, row, $el, field) {
    if (field === 'action') return;
    showModelDetail(row);
  });

  // History detail - bootstrap-table row click
  $('#myhistories-table').on('click-row.bs.table', function (e, row) {
    showMyHistoryDetail(row);
  });
  $('#admin-histories-table').on('click-row.bs.table', function (e, row) {
    showAdminHistoryDetail(row);
  });

  // Admin history detail - JSON tab copy (hidden when Clipboard API unavailable; see histories.html)
  $(document).on('click', '#admin-history-detail-json-copy', function () {
    var $btn = $(this);
    var text = $('#admin-history-detail-json').text();
    if (!text) return;
    navigator.clipboard.writeText(text).then(function () {
      var orig = $btn.html();
      $btn.html('<i class="bi bi-check2" aria-hidden="true"></i> Copied');
      setTimeout(function () { $btn.html(orig); }, 1200);
    }).catch(function () {
      // clipboard write failed — silently ignore
    });
  });
}

/* ============================================
   Accordion toggle (deploy model form)
   ============================================ */
function initAdvancedToggle() {
  var $el = $('#advanced-settings');
  if (!$el.length) return;
  $el.on('show.bs.collapse', function () {
    $('#advanced-chevron').removeClass('bi-chevron-down').addClass('bi-chevron-up');
  });
  $el.on('hide.bs.collapse', function () {
    $('#advanced-chevron').removeClass('bi-chevron-up').addClass('bi-chevron-down');
  });
}

/* ============================================
   New-key alert fade-in
   ============================================ */
function initNewKeyAlert() {
  var params = new URLSearchParams(window.location.search);
  if (!params.has('key_name')) return;
  var $wrapper = $('#newkey-alert');
  if (!$wrapper.length) return;
  $wrapper.show();
  // Trigger Bootstrap fade-in on next frame
  requestAnimationFrame(function () {
    $wrapper.find('.alert').addClass('show');
  });
  // Remove wrapper when alert is dismissed
  $wrapper.find('.btn-close').on('click', function () {
    $wrapper.remove();
  });
}

/* ============================================
   Auto-refresh toggle (move to bottom)
   ============================================ */
function initAutoRefreshToggle() {
  var $table = $('#model-settings-table');
  if (!$table.length) return;

  // Hide the empty toolbar generated by bootstrap-table
  $table.closest('.bootstrap-table').find('.fixed-table-toolbar').hide();
}

/* ============================================
   Toast Notification System
   ============================================ */
function showToast(message, type) {
  var iconMap = { success: 'bi-check-circle-fill', error: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
  var $container = $('#toast-container');
  if (!$container.length) {
    $('body').append('<div id="toast-container" class="position-fixed top-0 end-0 p-3" style="z-index:1080"></div>');
    $container = $('#toast-container');
  }
  var $toast = $('<div class="rd-toast rd-toast--' + (type || 'info') + '">' +
    '<i class="bi ' + (iconMap[type] || iconMap.info) + '"></i> ' +
    '<span>' + escapeHtml(message) + '</span>' +
    '<button type="button" class="rd-toast__dismiss">&times;</button>' +
    '</div>');
  $container.append($toast);
  requestAnimationFrame(function() { $toast.addClass('rd-toast--visible'); });
  var timer = setTimeout(function() { dismissToast($toast); }, 4000);
  $toast.find('.rd-toast__dismiss').on('click', function() {
    clearTimeout(timer);
    dismissToast($toast);
  });
}

function dismissToast($toast) {
  $toast.removeClass('rd-toast--visible');
  setTimeout(function() { $toast.remove(); }, 300);
}

/* ============================================
   Form Validation Helpers
   ============================================ */
function validateRequired(fieldId, errorMsg) {
  var $field = $('#' + fieldId);
  var val = $field.val().trim();
  if (!val) {
    showFieldError($field, errorMsg || 'This field is required');
    return false;
  }
  clearFieldError($field);
  return true;
}

function validateEmail(fieldId) {
  var $field = $('#' + fieldId);
  var val = $field.val().trim();
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (val && !re.test(val)) {
    showFieldError($field, 'Please enter a valid email address');
    return false;
  }
  clearFieldError($field);
  return true;
}

function validateJson(fieldId) {
  var $field = $('#' + fieldId);
  var val = $field.val().trim();
  if (val) {
    try { JSON.parse(val); } catch (e) {
      showFieldError($field, 'Invalid JSON format: ' + e.message);
      return false;
    }
  }
  clearFieldError($field);
  return true;
}

function showFieldError($field, message) {
  clearFieldError($field);
  $field.addClass('rd-field-error');
  var $msg = $('<div class="rd-error-message">' + escapeHtml(message) + '</div>');
  $field.after($msg);
}

function clearFieldError($field) {
  $field.removeClass('rd-field-error').removeClass('rd-field-success');
  $field.siblings('.rd-error-message').remove();
}

function showFieldSuccess($field) {
  clearFieldError($field);
  $field.addClass('rd-field-success');
}

/* ============================================
   Button Loading State
   ============================================ */
function setButtonLoading($btn, loading) {
  if (loading) {
    $btn.data('original-html', $btn.html());
    $btn.addClass('rd-btn--loading').prop('disabled', true);
    $btn.html('<span class="spinner-border spinner-border-sm me-1"></span> Processing...');
  } else {
    $btn.removeClass('rd-btn--loading').prop('disabled', false);
    $btn.html($btn.data('original-html'));
  }
}

/* ============================================
   Confirmation Dialog Enhancement
   ============================================ */
function initDestructiveModals() {
  $(document).on('change', '.rd-modal__checkbox-confirm input[type="checkbox"]', function() {
    var $modal = $(this).closest('.modal');
    var $submitBtn = $modal.find('[type="submit"], .js-confirm-action');
    $submitBtn.prop('disabled', !this.checked);
  });

  $(document).on('show.bs.modal', function(e) {
    var $modal = $(e.target);
    var $checkbox = $modal.find('.rd-modal__checkbox-confirm input[type="checkbox"]');
    if ($checkbox.length) {
      $checkbox.prop('checked', false);
      $modal.find('[type="submit"], .js-confirm-action').prop('disabled', true);
    }
  });
}

/* ============================================
   Form Validation on Blur
   ============================================ */
function initFieldValidation() {
  $(document).on('blur', '[required], .js-validate-required', function() {
    var $field = $(this);
    if (!$field.val().trim()) {
      showFieldError($field, 'This field is required');
    } else {
      showFieldSuccess($field);
    }
  });

  $(document).on('blur', '[type="email"], .js-validate-email', function() {
    var $field = $(this);
    var val = $field.val().trim();
    if (val) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(val)) {
        showFieldError($field, 'Please enter a valid email address');
      } else {
        showFieldSuccess($field);
      }
    }
  });

  $(document).on('blur', '.js-validate-json', function() {
    var $field = $(this);
    var val = $field.val().trim();
    if (val) {
      try { JSON.parse(val); showFieldSuccess($field); }
      catch(e) { showFieldError($field, 'Invalid JSON: ' + e.message); }
    }
  });
}

/* ============================================
   Form Submit Handling
   ============================================ */
function initFormSubmit() {

  // --- Deploy Model Form ---
  $(document).on('submit', 'form[action="/model/deploy"]', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');

    // Validate required fields
    var valid = true;
    if (!$('#model_source').val().trim()) {
      showFieldError($('#model_source'), 'Model source is required');
      valid = false;
    }
    if (!$('#model_name').val().trim()) {
      showFieldError($('#model_name'), 'Model name is required');
      valid = false;
    }
    // Validate JSON if advanced settings is open and has content
    var $params = $('#parameters');
    if ($params.is(':visible') && $params.val().trim()) {
      try { JSON.parse($params.val().trim()); }
      catch (err) {
        showFieldError($params, 'Invalid JSON: ' + err.message);
        valid = false;
      }
    }
    if (!valid) {
      showFormError('#deploy-form-error', 'Please fix the errors above before submitting.');
      return;
    }

    hideFormError('#deploy-form-error');
    setButtonLoading($btn, true);

    // Advance step indicator
    setTimeout(function () {
      // Move step 2 to completed, step 3 to active
      var $steps = $form.closest('.rd-card__body').find('.rd-steps');
      $steps.find('.rd-step--active')
        .removeClass('rd-step--active').addClass('rd-step--completed')
        .find('.rd-step__number').html('<i class="bi bi-check"></i>');
      $steps.find('.rd-step--upcoming')
        .removeClass('rd-step--upcoming').addClass('rd-step--active');

      setButtonLoading($btn, false);
      showToast('Model deployment started successfully', 'success');

      // Redirect after brief pause
      setTimeout(function () {
        location.href = './model_settings.html';
      }, 1500);
    }, 1200);
  });

  // --- Mail Settings Form ---
  $(document).on('submit', 'form[action="/mail/settings"]', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');
    var valid = true;

    $form.find('[required]').each(function () {
      if (!$(this).val().trim()) {
        showFieldError($(this), 'This field is required');
        valid = false;
      }
    });
    if (!valid) {
      showFormError('#mail-form-error', 'Please fill in all required fields.');
      return;
    }

    hideFormError('#mail-form-error');
    setButtonLoading($btn, true);

    setTimeout(function () {
      setButtonLoading($btn, false);
      showToast('Mail settings saved successfully', 'success');
    }, 800);
  });

  // --- Team Edit Form ---
  $(document).on('submit', 'form[action="/team/edit"]', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');

    setButtonLoading($btn, true);
    setTimeout(function () {
      setButtonLoading($btn, false);
      showToast('Team updated successfully', 'success');
    }, 800);
  });

  // --- User Edit Form ---
  $(document).on('submit', 'form[action="/user/edit"]', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');

    setButtonLoading($btn, true);
    setTimeout(function () {
      setButtonLoading($btn, false);
      showToast('User updated successfully', 'success');
    }, 800);
  });

  // --- Add Key Modal (teams page) ---
  $(document).on('submit', '#key-new-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');

    setButtonLoading($btn, true);
    setTimeout(function () {
      var modalEl = document.getElementById('key-new-modal');
      if (modalEl) {
        var modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      setButtonLoading($btn, false);
      showToast('API key created successfully', 'success');
    }, 800);
  });

  // --- Model Remove (model_settings) ---
  $(document).on('click', '.js-remove-model', function (e) {
    e.stopPropagation();
    var $btn = $(this);
    var $row = $btn.closest('tr');

    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span>');
    setTimeout(function () {
      $row.css({
        'transition': 'opacity 0.4s, transform 0.4s',
        'opacity': '0',
        'transform': 'translateX(20px)'
      });
      setTimeout(function () {
        $row.remove();
        showToast('Model removed successfully', 'success');
      }, 400);
    }, 600);
  });
}

/* Helper: show/hide form-level error */
function showFormError(selector, message) {
  var $el = $(selector);
  $el.find('.rd-alert__body').text(message);
  $el.slideDown(200);
}

function hideFormError(selector) {
  $(selector).slideUp(200);
}

/* ============================================
   Fade-in Animation Init
   ============================================ */
function initFadeIn() {
  $('.rd-fade-in').each(function(i) {
    var $el = $(this);
    setTimeout(function() { $el.addClass('rd-fade-in--visible'); }, i * 80);
  });
}

/* ============================================
   Init on DOM ready
   ============================================ */
$(function () {
  initCopyButtons();
  initAdvancedToggle();
  initEventDelegation();
  initNewKeyAlert();
  initAutoRefreshToggle();
  initDestructiveModals();
  initFieldValidation();
  initFormSubmit();
  initFadeIn();
  initAdminHistoriesSearch();
});
