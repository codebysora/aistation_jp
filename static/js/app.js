/**
 * AIStation Dashboard - Redesign Common JS
 */

/** Model row pending removal (model_management confirmation modal). */
var modelManagementPendingRemoveRow = null;

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
function showCopyFeedback($parent) {
  $parent.find('span.balloon_top').remove();
  $parent.prepend('<span class="balloon_top">Copied!</span>');
  setTimeout(function () { $parent.find('span.balloon_top').remove(); }, 1200);
}

function copyTextToClipboard(text, $feedbackParent) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(function () {
    if ($feedbackParent && $feedbackParent.length) showCopyFeedback($feedbackParent);
  }).catch(function () {
    // clipboard write failed — silently ignore
  });
}

function textFromCopyParent($parent) {
  return $parent.clone().children('button, span.balloon_top').remove().end().text().trim();
}

function appendCopyButton($parent, title) {
  if (!$parent.length || $parent.find('.cpybtn').length) return;
  $parent.append(
    '<button type="button" class="cpybtn" title="' + escapeHtml(title || 'Copy') + '">' +
    '<i class="bi bi-copy"></i></button>'
  );
}

function initCopyButtons() {
  $('.cpytext').each(function () {
    appendCopyButton($(this));
  });
  $(document).on('click', '.cpybtn', function (e) {
    var $btn = $(this);
    var $parent = $btn.parent();
    var text = $btn.data('copy-text') || textFromCopyParent($parent);
    e.stopPropagation();
    copyTextToClipboard(text, $parent);
  });
}

/* ============================================
   Table formatters - Keys page
   ============================================ */
function keyIdFormatter(value) {
  if (!value) return '<span class="text-muted">—</span>';
  var id = String(value);
  var short = id.length > 16 ? id.slice(0, 10) + '…' + id.slice(-6) : id;
  return '<code class="rd-key-id" title="' + escapeHtml(id) + '">' + escapeHtml(short) + '</code>';
}

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

/** Team Management (admin): edit team only — no Add Key. */
function teamManagementActionFormatter(value, row) {
  if (row.team_name === 'default') {
    return '<span class="text-muted">—</span>';
  }
  return '<button type="button" class="btn btn-link rd-link-action text-dark p-1 js-edit-team"' +
    ' data-team-id="' + escapeHtml(row.team_id) + '">' +
    '<i class="bi bi-pencil-square me-1" aria-hidden="true"></i>Edit</button>';
}

/* ============================================
   Table formatters - Models
   ============================================ */
/** Green: Active, Ready. Red: Failed. Gray: Processing, Terminating, and others. */
function getModelStatusCssClass(status) {
  var s = String(status || '').trim();
  if (s === 'Active' || s === 'Ready') return 'c-model-status--active';
  if (s === 'Failed') return 'c-model-status--failed';
  return 'c-model-status--neutral';
}

function modelStatusFormatter(value) {
  var s = String(value || '').trim();
  if (!s) return '<span class="text-muted">—</span>';
  return '<span class="' + getModelStatusCssClass(s) + '">' + escapeHtml(s) + '</span>';
}

function modelRemoveFormatter(value, row) {
  var label = row.label || row.model_name || '-';
  return '<button type="button" class="btn btn-link rd-link-danger p-0 border-0 js-remove-model"' +
    ' data-model-label="' + escapeHtml(label) + '"' +
    ' data-model-name="' + escapeHtml(row.model_name || '') + '">' +
    '<i class="bi bi-x-circle me-1"></i>Remove</button>';
}

function setModelRemoveTarget(label, modelName) {
  $('#model-remove-label').text(label || modelName || '-');
  $('#model-remove-model-name').val(modelName || '');
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
    ' data-user-id="' + escapeHtml(row.user_id) + '"' +
    ' data-email="' + escapeHtml(row.email) + '"' +
    ' data-team-role="' + escapeHtml(row.team_role || '') + '">' +
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

/** Read admin histories search form values (trimmed). */
function getAdminHistoriesSearchFilters() {
  var status = ($('input[name="status"]:checked').val() || '').trim().toLowerCase();
  return {
    username: ($('#histories-search-username').val() || '').trim().toLowerCase(),
    model: ($('#histories-search-model').val() || '').trim().toLowerCase(),
    status: status,
    datetime_from: $('#histories-search-datetime-from').val() || '',
    datetime_to: $('#histories-search-datetime-to').val() || ''
  };
}

function historyRowUsername(row) {
  if (row.username) return String(row.username);
  if (row.end_user) return String(row.end_user);
  var meta = row.metadata_ || row.metadata || {};
  if (meta.user_email) return String(meta.user_email);
  if (meta.user_api_key_alias) return String(meta.user_api_key_alias);
  return String(row.user_id || '');
}

/** Parse history start_time to milliseconds (supports "YYYY-MM-DD HH:mm:ss.ffffff"). */
function historyRowStartMs(row) {
  if (!row || !row.start_time) return null;
  var s = String(row.start_time).trim().replace(' ', 'T').replace(/\.\d+$/, '');
  var ms = Date.parse(s);
  return isNaN(ms) ? null : ms;
}

function datetimeLocalToMs(value) {
  if (!value) return null;
  var ms = Date.parse(String(value).trim());
  return isNaN(ms) ? null : ms;
}

function adminHistoriesFiltersActive(filters) {
  return !!(
    filters.username ||
    filters.model ||
    filters.status ||
    filters.datetime_from ||
    filters.datetime_to
  );
}

function matchesAdminHistoriesFilters(row, filters) {
  if (filters.username) {
    if (historyRowUsername(row).toLowerCase().indexOf(filters.username) === -1) {
      return false;
    }
  }
  if (filters.model) {
    if (String(row.model || '').toLowerCase().indexOf(filters.model) === -1) {
      return false;
    }
  }
  if (filters.status === 'success' && row.status !== 'success') {
    return false;
  }
  if (filters.status === 'failure' && row.status !== 'failure') {
    return false;
  }
  var rowMs = historyRowStartMs(row);
  var fromMs = datetimeLocalToMs(filters.datetime_from);
  var toMs = datetimeLocalToMs(filters.datetime_to);
  if (fromMs != null) {
    if (rowMs == null || rowMs < fromMs) return false;
  }
  if (toMs != null) {
    if (rowMs == null || rowMs > toMs) return false;
  }
  return true;
}

/** Admin histories table: merge bootstrap-table params with search form values for server requests. */
function adminHistoriesQueryParams(params) {
  var filters = getAdminHistoriesSearchFilters();
  return {
    search: params.search,
    sort: params.sort,
    order: params.order,
    offset: params.offset,
    limit: params.limit,
    username: filters.username,
    model: filters.model,
    status: filters.status,
    datetime_from: filters.datetime_from,
    datetime_to: filters.datetime_to
  };
}

function normalizeHistoryRows(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

function filterAdminHistoriesRows(rows, filters) {
  if (!adminHistoriesFiltersActive(filters)) return rows;
  return rows.filter(function (row) {
    return matchesAdminHistoriesFilters(row, filters);
  });
}

/** Apply search filters client-side (static JSON / mock endpoints ignore query params). */
function getMyHistoriesUserEmail() {
  var $body = $('body');
  return String($body.attr('data-rd-user-email') || $body.data('rdUserEmail') || '').trim().toLowerCase();
}

/** User histories: only rows for the signed-in user (mock UI). */
function myHistoriesResponseHandler(res) {
  var rows = normalizeHistoryRows(res);
  var email = getMyHistoriesUserEmail();
  if (email) {
    rows = rows.filter(function (row) {
      return historyRowUsername(row).toLowerCase() === email;
    });
  }
  // Must match data-data-field="data" on #myhistories-table (bootstrap-table reads res.data).
  return { data: rows };
}

function loadMyHistoriesTableRows($table, source) {
  if (!$table || !$table.length || !source) return;
  var rows = myHistoriesResponseHandler(source).data || [];
  $table.bootstrapTable('load', rows);
}

function initMyHistoriesTable() {
  var $table = $('#myhistories-table');
  if (!$table.length) return;
  var historiesUrl = './static/test.json';

  function loadFromSharedJson() {
    $.getJSON(historiesUrl)
      .done(function (res) { loadMyHistoriesTableRows($table, res); });
  }

  $table.on('load-error.bs.table', loadFromSharedJson);

  $table.on('load-success.bs.table', function (e, data) {
    if (data && data.length) return;
    loadFromSharedJson();
  });

  window.setTimeout(function () {
    if ($table.bootstrapTable('getData').length) return;
    loadFromSharedJson();
  }, 200);
}

function adminHistoriesResponseHandler(res) {
  var rows = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : null);
  if (!rows) return res;
  var filters = getAdminHistoriesSearchFilters();
  var filtered = filterAdminHistoriesRows(rows, filters);
  if (Array.isArray(res)) return filtered;
  var out = $.extend(true, {}, res, { data: filtered });
  if (out.meta) {
    out.meta.total = filtered.length;
    var perPage = out.meta.per_page || 20;
    out.meta.total_pages = Math.max(1, Math.ceil(filtered.length / perPage));
  }
  return out;
}

function applyAdminHistoriesSearch($table) {
  var filters = getAdminHistoriesSearchFilters();
  var cached = $table.data('historiesSourceRows');

  function showFiltered(rows) {
    $table.data('historiesSkipCache', true);
    $table.bootstrapTable('load', filterAdminHistoriesRows(rows, filters));
    $table.bootstrapTable('selectPage', 1);
  }

  if (cached && cached.length) {
    showFiltered(cached);
    return;
  }

  var url = $table.bootstrapTable('getOptions').url;
  $.getJSON(url).done(function (res) {
    var rows = Array.isArray(res) ? res : (res && res.data) || [];
    rows = rows.slice();
    $table.data('historiesSourceRows', rows);
    showFiltered(rows);
  });
}

function initAdminHistoriesSearch() {
  var $form = $('#histories-search-form');
  var $table = $('#admin-histories-table');
  if (!$form.length || !$table.length) return;

  $table.bootstrapTable('refreshOptions', {
    responseHandler: adminHistoriesResponseHandler
  });

  $table.on('load-success.bs.table', function (e, data) {
    if ($table.data('historiesSkipCache')) {
      $table.data('historiesSkipCache', false);
      return;
    }
    var rows = normalizeHistoryRows(data);
    if (rows.length) {
      $table.data('historiesSourceRows', rows.slice());
    }
  });

  // Table may finish loading before load-success is bound — seed cache from JSON
  setTimeout(function () {
    if ($table.data('historiesSourceRows')) return;
    var url = $table.bootstrapTable('getOptions').url;
    if (!url) return;
    $.getJSON(url).done(function (res) {
      if ($table.data('historiesSourceRows')) return;
      var rows = Array.isArray(res) ? res : (res && res.data) || [];
      if (rows.length) $table.data('historiesSourceRows', rows.slice());
    });
  }, 0);

  $form.on('submit', function (e) {
    e.preventDefault();
    applyAdminHistoriesSearch($table);
  });

  $form.on('change', 'input[name="status"]', function () {
    applyAdminHistoriesSearch($table);
  });
}

function formatLatency(e2el) {
  if (!e2el) return '-';
  var m = String(e2el).match(/^(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return String(e2el);
  var s = parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseFloat(m[3]);
  return s.toFixed(2) + 's';
}

function buildHistorySummary(row, options) {
  options = options || {};
  var limited = options.limited === true;
  var statusBadge = row.status === 'success'
    ? '<span class="c-model-status--active">success</span>'
    : '<span class="c-model-status--failed">' + escapeHtml(row.status || '-') + '</span>';
  var time = String(row.start_time || '').replace(/\.\d+$/, '');
  var html = statusBadge +
    '<span class="badge bg-light text-dark border fw-normal">' + escapeHtml(time || '-') + '</span>' +
    '<span class="badge bg-light text-dark border fw-normal">Model: ' + escapeHtml(row.model || '-') + '</span>';
  if (limited) {
    html += '<span class="badge bg-light text-dark border fw-normal">' +
      Number(row.total_tokens || 0).toLocaleString() + ' tokens</span>';
  } else {
    var prompt = Number(row.prompt_tokens || 0).toLocaleString();
    var completion = Number(row.completion_tokens || 0).toLocaleString();
    html += '<span class="badge bg-light text-dark border fw-normal">Latency: ' + escapeHtml(formatLatency(row.e2el)) + '</span>' +
      '<span class="badge bg-light text-dark border fw-normal">' + prompt + ' prompt &rarr; ' + completion + ' completion</span>';
  }
  return html;
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
    '<thead><tr><th class="rd-model-detail-th-path">Path</th><th>Value</th></tr></thead>' +
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
  var showTags = options.showTags !== false;
  var html = '';

  // Tags
  var tags = row.request_tags || [];
  if (showTags && tags.length) {
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
  $('#myhistory-detail-modal-label').text('Request Detail');
  $('#myhistory-detail-summary').html(buildHistorySummary(row, { limited: true }));
  $('#myhistory-detail-preview').html(buildHistoryPreview(row, {
    showMetadata: false,
    showTraceback: false,
    showTags: false
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
  var statusClass = getModelStatusCssClass(data.status);
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
    html += '<dt class="col-sm-4 py-2 text-body-secondary rd-model-detail-dt">' + escapeHtml(f.label) + '</dt>';
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
   Add / Remove actions (teams, members, keys, deploy form)
   ============================================ */
function initAddRemoveActions() {
  var deleteKeyId = null;

  $(document).on('click', '.js-delete-key', function () {
    var $el = $(this);
    deleteKeyId = $el.data('key-id');
    setDeleteTarget(deleteKeyId, $el.data('key-masked'));
    var modalEl = document.getElementById('key-delete-modal');
    if (!modalEl) return;
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  });

  $(document).on('submit', '#key-delete-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');
    var $keysTable = $('#keys-table');
    var keyId = deleteKeyId || $('#key-delete-key-id').val();
    setButtonLoading($btn, true);

    setTimeout(function () {
      var modalEl = document.getElementById('key-delete-modal');
      if (modalEl) {
        var modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      setButtonLoading($btn, false);
      deleteKeyId = null;

      if (keyId && $keysTable.length) {
        removeBootstrapTableRowAnimated($keysTable, keyId);
      }
    }, 600);
  });

  $(document).on('submit', '#team-new-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $name = $('#team_name');
    var name = ($name.val() || '').trim();
    if (!name) {
      showFieldError($name, 'Team name is required');
      return;
    }
    clearFieldError($name);

    var $table = $('#teams-table');
    if (!$table.length) return;

    var $btn = $form.find('[type="submit"]');
    setButtonLoading($btn, true);
    setTimeout(function () {
      var now = new Date().toISOString();
      $table.bootstrapTable('prepend', {
        team_id: generateMockTeamId(),
        team_name: name,
        member_count: 0,
        tpm_limit: null,
        rpm_limit: null,
        created_at: now,
        updated_at: now
      });
      var modalEl = document.getElementById('team-new-modal');
      if (modalEl) {
        var modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      $form[0].reset();
      setButtonLoading($btn, false);
      showToast('Team added successfully', 'success');
    }, 600);
  });

  $(document).on('click', '.js-set-team-role', function (e) {
    e.preventDefault();
    var $el = $(this);
    var teamId = $el.data('team-id');
    var role = $el.data('team-role');
    var $table = $('#teams-table');
    if (!teamId || !$table.length) return;

    setTeamRoleTarget(teamId, role);

    if (role === '-') {
      removeBootstrapTableRowAnimated($table, teamId, 'Removed from team');
      return;
    }

    var row = $table.bootstrapTable('getRowByUniqueId', teamId);
    if (!row) return;
    $table.bootstrapTable('updateByUniqueId', {
      id: teamId,
      row: $.extend({}, row, { team_role: role })
    });
    showToast('Team role updated', 'success');
  });

  $(document).on('click', '.js-add-member', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var email = $(this).data('email');
    if (!appendMemberTag(email)) {
      showToast('Member already selected', 'error');
      return;
    }
    showToast('Member added to selection', 'success');
  });

  $(document).on('click', '.js-remove-member', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $btn = $(this);
    var userId = $btn.data('user-id');
    var email = $btn.data('email');
    var teamRole = $btn.data('team-role');
    var $table = $('#members-table');
    if (userId && $table.length) {
      if (!teamRole) {
        var row = $table.bootstrapTable('getRowByUniqueId', userId);
        if (row && row.team_role) teamRole = row.team_role;
      }
      appendTeamEditRemovedMember(userId, teamRole);
      removeBootstrapTableRowAnimated($table, userId);
    }
    removeMemberTagByEmail(email);
  });

  $(document).on('click', '.js-bulk-add-members', function (e) {
    e.preventDefault();
    var $container = getMemberTagsContainer();
    var $input = $('#emailInput');
    if ($input.length && $input.val().trim()) {
      appendMemberTag($input.val().trim());
      $input.val('');
    }
    if (!$container.length) return;

    var emails = [];
    $container.find('.c-member-tag').each(function () {
      var text = $(this).clone().children().remove().end().text().trim();
      if (text) emails.push(text);
    });
    if (!emails.length) {
      showToast('Select or enter at least one member email', 'error');
      return;
    }

    var role = getMemberPickerRole();
    var added = 0;
    var skipped = 0;
    emails.forEach(function (email) {
      if (commitMemberToTable(email, role)) {
        added++;
        removeMemberTagByEmail(email);
      } else {
        skipped++;
      }
    });

    if (added) {
      showToast(added + ' member(s) added to team', 'success');
    }
    if (skipped && !added) {
      showToast('All selected members are already on the team', 'error');
    } else if (skipped) {
      showToast(skipped + ' member(s) already on the team', 'error');
    }
  });

  $(document).on('keydown', '#emailInput', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    var email = $(this).val().trim();
    if (!email) return;
    if (!appendMemberTag(email)) {
      showToast('Member already selected', 'error');
      return;
    }
    $(this).val('');
  });

  $(document).on('click', '.p-selected-members', function (e) {
    var $removeBtn = $(e.target).closest('.c-member-tag button[aria-label="Remove"]');
    if ($removeBtn.length) {
      e.preventDefault();
      e.stopPropagation();
      $removeBtn.closest('.c-member-tag').remove();
      return;
    }
    var $dropdown = $(this).closest('.c-member-dropdown, .dropdown');
    var $menu = $dropdown.find('.c-member-dropdown__menu, > .dropdown-menu').first();
    if (!$menu.length) return;
    $menu.toggleClass('show');
    $(this).attr('aria-expanded', $menu.hasClass('show'));
  });

  $(document).on('click', function (e) {
    if ($(e.target).closest('.c-member-dropdown, .dropdown').length) return;
    $('.c-member-dropdown__menu.show, .dropdown > .dropdown-menu.show').removeClass('show');
    $('.p-selected-members[aria-expanded="true"]').attr('aria-expanded', 'false');
  });
}

function initDeployFormAddRemove() {
  if (!$('#args-container').length) return;

  function makeArgTag(value) {
    var $wrap = $('<div class="c-tag-item"></div>').attr('data-value', value);
    $wrap.append($('<span class="c-tag-item__text"></span>').text(value));
    $wrap.append(
      '<button type="button" class="c-tag-item__remove js-remove-arg" aria-label="Remove">' +
      '<i class="bi bi-x"></i></button>'
    );
    return $wrap;
  }

  function makeKvRow(key, value) {
    var valStr = (typeof value === 'object' && value !== null)
      ? JSON.stringify(value)
      : String(value != null ? value : '');
    var $wrap = $('<div class="c-kv-row"></div>');
    $wrap.append(
      $('<input type="text" class="form-control form-control-sm c-kv-row__key">')
        .attr('placeholder', 'key').val(key)
    );
    $wrap.append(
      $('<input type="text" class="form-control form-control-sm c-kv-row__value">')
        .attr('placeholder', 'value').val(valStr)
    );
    $wrap.append(
      '<button type="button" class="btn btn-sm btn-outline-danger c-kv-row__remove js-remove-kv" aria-label="Remove">' +
      '<i class="bi bi-x"></i></button>'
    );
    return $wrap;
  }

  $(document).on('click.deployFormAddRemove', '.js-add-arg', function () {
    var $input = $('#new-arg-input');
    var val = ($input.val() || '').trim();
    if (!val) return;
    $('#args-container').append(makeArgTag(val));
    $input.val('');
  });

  $(document).on('keydown.deployFormAddRemove', '#new-arg-input', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      $('.js-add-arg').first().trigger('click');
    }
  });

  $(document).on('click.deployFormAddRemove', '.js-add-kwarg', function () {
    $('#kwargs-container').append(makeKvRow('', ''));
  });

  $(document).on('click.deployFormAddRemove', '.js-add-env', function () {
    $('#env-container').append(makeKvRow('', ''));
  });

  $(document).on('click.deployFormAddRemove', '#args-container', function (e) {
    var $btn = $(e.target).closest('.js-remove-arg');
    if ($btn.length) $btn.closest('.c-tag-item').remove();
  });

  $(document).on('click.deployFormAddRemove', '#kwargs-container, #env-container', function (e) {
    var $btn = $(e.target).closest('.js-remove-kv');
    if ($btn.length) $btn.closest('.c-kv-row').remove();
  });
}

/* ============================================
   Event delegation (replaces inline onclick)
   ============================================ */
function initEventDelegation() {

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

  // Back navigation buttons
  $(document).on('click', '.js-back-to-user-list', function () {
    location.href = './user_management.html';
  });
  $(document).on('click', '.js-back-to-model-select', function () {
    location.href = './deploy_model_select.html';
  });

  // Model detail - bootstrap-table row click (user models list)
  $('#models-table').on('click-row.bs.table', function (e, row, $el, field) {
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

  // Admin history detail - JSON tab copy (hidden when Clipboard API unavailable; see admin_histories.html)
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
   New API key — create feedback & scroll-to-row
   ============================================ */
function isUserRoleContext() {
  return /userRole/i.test(window.location.pathname || '');
}

function getKeysListUrl() {
  return isUserRoleContext() ? './userRole_keys.html' : './keys.html';
}

function generateMockKeyId() {
  var hex = '0123456789abcdef';
  var out = '';
  for (var i = 0; i < 64; i++) {
    out += hex[Math.floor(Math.random() * 16)];
  }
  return out;
}

function generateMockKeySecret() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var out = 'sk-';
  for (var i = 0; i < 24; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function generateMockTeamId() {
  var hex = '0123456789abcdef';
  var out = '';
  for (var i = 0; i < 32; i++) {
    out += hex[Math.floor(Math.random() * 16)];
  }
  return out;
}

function generateMockUserId() {
  var hex = '0123456789abcdef';
  var out = '';
  for (var i = 0; i < 32; i++) {
    out += hex[Math.floor(Math.random() * 16)];
  }
  return out;
}

function removeBootstrapTableRowAnimated($table, uniqueId, toastMessage) {
  if (!$table.length || !uniqueId) return;
  var $tr = $table.find('tbody tr').filter(function () {
    var uid = $(this).attr('data-uniqueid') || $(this).data('uniqueid');
    return String(uid) === String(uniqueId);
  });
  var finish = function () {
    $table.bootstrapTable('removeByUniqueId', uniqueId);
    if (toastMessage) showToast(toastMessage, 'success');
  };
  if ($tr.length) {
    $tr.css({
      transition: 'opacity 0.4s, transform 0.4s',
      opacity: '0',
      transform: 'translateX(20px)'
    });
    setTimeout(finish, 400);
  } else {
    finish();
  }
}

function getMemberPickerRole() {
  var $checked = $('input[name="role"]:checked');
  return ($checked.length ? $checked.val() : null) || 'member';
}

function getTeamEditForm() {
  return $('form[action="/team/edit"]').first();
}

function getTeamEditRemovedFieldsContainer() {
  var $form = getTeamEditForm();
  if (!$form.length) return $();
  var $box = $form.find('#team-edit-removed-fields');
  if (!$box.length) {
    $box = $('<div id="team-edit-removed-fields" class="visually-hidden" aria-hidden="true"></div>');
    var $csrf = $form.find('input[name="csrf_token"]').first();
    if ($csrf.length) {
      $csrf.after($box);
    } else {
      $form.prepend($box);
    }
  }
  return $box;
}

/** Append hidden user_id + team_role pair for POST /team/edit (removed member). */
function appendTeamEditRemovedMember(userId, teamRole) {
  if (!userId) return;
  var $box = getTeamEditRemovedFieldsContainer();
  if (!$box.length) return;
  $box.append(
    '<input type="hidden" name="user_id" value="' + escapeHtml(userId) + '">' +
    '<input type="hidden" name="team_role" value="' + escapeHtml(teamRole || 'member') + '">'
  );
}

function initTeamEditForm() {
  var $form = getTeamEditForm();
  if (!$form.length) return;
  var params = new URLSearchParams(window.location.search);
  var teamId = params.get('team_id');
  if (teamId) {
    $form.find('#team-edit-team-id, input[name="team_id"]').first().val(teamId);
  }
}

function getMemberTagsContainer() {
  return $('.p-selected-members').first();
}

function memberTagExists($container, email) {
  var normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return false;
  var found = false;
  $container.find('.c-member-tag').each(function () {
    var text = $(this).clone().children().remove().end().text().trim().toLowerCase();
    if (text === normalized) found = true;
  });
  return found;
}

function appendMemberTag(email) {
  var $container = getMemberTagsContainer();
  if (!$container.length) return false;
  email = String(email || '').trim();
  if (!email) return false;
  if (memberTagExists($container, email)) return false;
  var $tag = $('<span class="d-inline-flex align-items-center rounded-pill text-dark c-member-tag"></span>');
  $tag.append(document.createTextNode(email));
  $tag.append(
    '<button type="button" class="btn p-0 d-inline-flex align-items-center justify-content-center" aria-label="Remove">' +
    '<i class="bi bi-x-circle text-dark"></i></button>'
  );
  $container.append($tag);
  return true;
}

function removeMemberTagByEmail(email) {
  var normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return;
  getMemberTagsContainer().find('.c-member-tag').each(function () {
    var $tag = $(this);
    var text = $tag.clone().children().remove().end().text().trim().toLowerCase();
    if (text === normalized) $tag.remove();
  });
}

function findMemberInSelectTable(email) {
  var $select = $('#members-select');
  if (!$select.length) return null;
  var data = $select.bootstrapTable('getData') || [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].email === email) return data[i];
  }
  return null;
}

function commitMemberToTable(email, role) {
  var $membersTable = $('#members-table');
  if (!$membersTable.length) return false;
  email = String(email || '').trim();
  if (!email) return false;
  var data = $membersTable.bootstrapTable('getData') || [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].email === email) return false;
  }
  var existing = findMemberInSelectTable(email);
  var userId = existing ? existing.user_id : generateMockUserId();
  $membersTable.bootstrapTable('append', {
    user_id: userId,
    email: email,
    team_role: role || getMemberPickerRole()
  });
  return true;
}

function maskKeySecret(secret) {
  if (!secret || secret.length < 8) return 'sk-…';
  return 'sk-…' + secret.slice(-4);
}

function buildNewKeyRow(payload) {
  var now = new Date().toISOString();
  return {
    key_id: payload.key_id,
    key_name: payload.key_name || 'new-key',
    key_masked: maskKeySecret(payload.key_secret),
    user_id: payload.user_id || null,
    team_id: payload.team_id || '',
    team_name: payload.team_name || '',
    tpm_limit: null,
    rpm_limit: null,
    expires: payload.expires || null,
    created_at: now,
    updated_at: now
  };
}

function prependKeyTableRow(row) {
  var $table = $('#keys-table');
  if (!$table.length) return false;
  try {
    $table.bootstrapTable('prepend', row);
    return true;
  } catch (e) {
    return false;
  }
}

function scrollToAndHighlightKey(keyId) {
  if (!keyId) return;
  var $table = $('#keys-table');
  if (!$table.length) return;

  var data = $table.bootstrapTable('getData') || [];
  var index = -1;
  for (var i = 0; i < data.length; i++) {
    if (String(data[i].key_id) === String(keyId)) {
      index = i;
      break;
    }
  }
  if (index < 0) return;

  var opts = $table.bootstrapTable('getOptions') || {};
  var pageSize = opts.pageSize || data.length || 10;
  if (opts.pagination) {
    var page = Math.floor(index / pageSize) + 1;
    $table.bootstrapTable('selectPage', page);
  }

  window.setTimeout(function () {
    var $row = $table.find('tbody tr[data-uniqueid="' + keyId + '"]');
    if (!$row.length) {
      $row = $table.find('tbody tr').filter(function () {
        return String($(this).data('uniqueid')) === String(keyId);
      });
    }
    if (!$row.length) return;

    $table.find('tbody tr').removeClass('rd-keys-row--highlight');
    $row.addClass('rd-keys-row--highlight');
    var el = $row[0];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.setTimeout(function () {
      $row.removeClass('rd-keys-row--highlight');
    }, 4500);
  }, 150);
}

function bindNewKeyAlertClick($wrapper) {
  var $alert = $wrapper.find('.rd-newkey-alert');
  $alert.off('click.rdNewKey keydown.rdNewKey');
  $alert.on('click.rdNewKey', function (e) {
    if ($(e.target).closest('.btn-close, .cpytext, .cpybtn').length) return;
    scrollToAndHighlightKey($wrapper.data('highlight-key-id'));
  });
  $alert.on('keydown.rdNewKey', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToAndHighlightKey($wrapper.data('highlight-key-id'));
    }
  });
}

function showNewKeyAlert(payload) {
  var $wrapper = $('#newkey-alert');
  if (!$wrapper.length) return false;

  $('#newkey-alert-name').text(payload.key_name || '—');
  $('#newkey-alert-secret').text(payload.key_secret || '');

  $wrapper.data('highlight-key-id', payload.key_id);
  $wrapper.removeClass('rd-is-hidden').show();

  var $alert = $wrapper.find('.rd-newkey-alert');
  requestAnimationFrame(function () {
    $alert.addClass('show');
  });

  bindNewKeyAlertClick($wrapper);

  $wrapper.find('.btn-close').off('click.rdNewKeyDismiss').on('click.rdNewKeyDismiss', function () {
    $wrapper.addClass('rd-is-hidden').hide();
  });

  return true;
}

function appendToastKeyRow($body, label, value, copyTitle) {
  var $row = $('<div class="rd-toast__key-row"></div>');
  $row.append($('<span class="rd-toast__key-label"></span>').text(label));
  var $valueRow = $('<div class="cpytext rd-toast__key-value-row"></div>');
  $valueRow.append($('<code class="rd-toast__key-value"></code>').text(value));
  appendCopyButton($valueRow, copyTitle);
  $valueRow.find('.cpybtn').attr('data-copy-text', value);
  $row.append($valueRow);
  $body.append($row);
}

function showKeyCreatedToast(payload, onNavigate) {
  var keySecret = payload.key_secret || '';
  var $container = $('#toast-container');
  if (!$container.length) {
    $('body').append('<div id="toast-container"></div>');
    $container = $('#toast-container');
  }

  var $toast = $('<div class="rd-toast rd-toast--success rd-toast--clickable rd-toast--persistent rd-toast--key-created" role="button" tabindex="0"></div>');
  $toast.append('<i class="bi bi-check-circle-fill rd-toast__icon" aria-hidden="true"></i>');

  var $body = $('<div class="rd-toast__body"></div>');
  $body.append('<div class="rd-toast__title">API key created</div>');
  if (keySecret) appendToastKeyRow($body, 'Secret Key', keySecret, 'Copy Secret Key');
  $body.append('<span class="rd-toast__action-hint">Click to open keys list</span>');
  $toast.append($body);
  $toast.append('<button type="button" class="rd-toast__dismiss" aria-label="Dismiss">&times;</button>');

  $container.append($toast);
  requestAnimationFrame(function () { $toast.addClass('rd-toast--visible'); });

  function go() {
    if (typeof onNavigate === 'function') onNavigate();
  }
  $toast.on('click', function (e) {
    if ($(e.target).closest('.rd-toast__dismiss, .rd-toast__key-row, .cpybtn').length) return;
    go();
  });
  $toast.on('keydown', function (e) {
    if ($(e.target).closest('.rd-toast__key-row').length) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go();
    }
  });
  $toast.find('.rd-toast__dismiss').on('click', function (e) {
    e.stopPropagation();
    dismissToast($toast);
  });
}

function redirectToKeysWithNewKey(payload) {
  var qs = new URLSearchParams({
    created: '1',
    key_id: payload.key_id,
    key_name: payload.key_name || '',
    key_secret: payload.key_secret || '',
    team_id: payload.team_id || '',
    team_name: payload.team_name || ''
  });
  location.href = getKeysListUrl() + '?' + qs.toString();
}

function handleKeyCreated(payload) {
  var row = buildNewKeyRow(payload);
  var onKeysPage = $('#keys-table').length > 0;

  if (onKeysPage) {
    prependKeyTableRow(row);
    if (!showNewKeyAlert(payload)) {
      showKeyCreatedToast(payload, function () {
        scrollToAndHighlightKey(payload.key_id);
      });
    } else {
      window.setTimeout(function () {
        scrollToAndHighlightKey(payload.key_id);
      }, 400);
    }
    return;
  }

  showKeyCreatedToast(payload, function () {
    redirectToKeysWithNewKey(payload);
  });
}

function initNewKeyAlert() {
  var params = new URLSearchParams(window.location.search);
  if (params.get('created') !== '1' || !params.get('key_id')) return;

  var payload = {
    key_id: params.get('key_id'),
    key_name: params.get('key_name') || '',
    key_secret: params.get('key_secret') || '',
    team_id: params.get('team_id') || '',
    team_name: params.get('team_name') || ''
  };

  if ($('#keys-table').length) {
    prependKeyTableRow(buildNewKeyRow(payload));
  }

  showNewKeyAlert(payload);
  window.setTimeout(function () {
    scrollToAndHighlightKey(payload.key_id);
  }, 500);

  if (window.history && window.history.replaceState) {
    var clean = getKeysListUrl();
    window.history.replaceState({}, '', clean);
  }
}

/* ============================================
   Model management page (model_management.html)
   ============================================ */
function initModelManagement() {
  var $table = $('#model-management-table');
  if (!$table.length) return;

  function hideBootstrapTableToolbar() {
    var $wrap = $table.closest('.bootstrap-table');
    if ($wrap.length) {
      $wrap.find('.fixed-table-toolbar').hide();
    } else {
      setTimeout(hideBootstrapTableToolbar, 50);
    }
  }
  hideBootstrapTableToolbar();

  $(document).on('click', '.js-model-management-refresh', function (e) {
    e.preventDefault();
    $table.bootstrapTable('refresh');
  });

  $table.on('click-row.bs.table', function (e, row, $el, field) {
    if (field === 'action') return;
    showModelDetail(row);
  });

  $(document).on('click.modelManagement', '.js-remove-model', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $btn = $(this);
    modelManagementPendingRemoveRow = $btn.closest('tr');
    setModelRemoveTarget($btn.attr('data-model-label'), $btn.attr('data-model-name'));
    var modalEl = document.getElementById('model-remove-modal');
    if (!modalEl) return;
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  });

  $(document).on('submit.modelManagement', '#model-remove-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');
    var $row = modelManagementPendingRemoveRow;
    setButtonLoading($btn, true);

    setTimeout(function () {
      var modalEl = document.getElementById('model-remove-modal');
      if (modalEl) {
        var modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      setButtonLoading($btn, false);

      if ($row && $row.length) {
        var rowIndex = $row.data('index');
        $row.css({
          transition: 'opacity 0.4s, transform 0.4s',
          opacity: '0',
          transform: 'translateX(20px)'
        });
        setTimeout(function () {
          if (rowIndex != null && rowIndex !== '') {
            $table.bootstrapTable('remove', { field: '$index', values: [rowIndex] });
          } else {
            $row.remove();
          }
          showToast('Model removed successfully', 'success');
          modelManagementPendingRemoveRow = null;
        }, 400);
      }
    }, 600);
  });

  $(document).on('hidden.bs.modal.modelManagement', '#model-remove-modal', function () {
    modelManagementPendingRemoveRow = null;
  });
}

/* ============================================
   Nav user menu — password change
   ============================================ */
function ensurePasswordChangeModal() {
  if ($('#password-change-modal').length) return;

  var html =
    '<div class="modal fade" id="password-change-modal" tabindex="-1" aria-labelledby="password-change-modal-label" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered rd-modal">' +
        '<div class="modal-content">' +
          '<div class="modal-header">' +
            '<h5 class="modal-title" id="password-change-modal-label">Change Password</h5>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
          '</div>' +
          '<form id="password-change-form" action="/password/change" method="POST" novalidate="novalidate">' +
            '<div class="modal-body pt-3">' +
              '<p class="text-muted small mb-3">Change your login password.</p>' +
              '<div id="password-change-form-error" class="rd-alert rd-alert--error mb-3 rd-is-hidden">' +
                '<div class="rd-alert__body"></div>' +
              '</div>' +
              '<div class="mb-3">' +
                '<label for="password-current" class="form-label">Current password</label>' +
                '<input type="password" class="form-control" id="password-current" name="current_password" autocomplete="current-password" required>' +
              '</div>' +
              '<div class="mb-3">' +
                '<label for="password-new" class="form-label">New password</label>' +
                '<input type="password" class="form-control" id="password-new" name="new_password" autocomplete="new-password" required>' +
                '<div class="form-text">Use at least 8 characters.</div>' +
              '</div>' +
              '<div class="mb-4">' +
                '<label for="password-confirm" class="form-label">Confirm new password</label>' +
                '<input type="password" class="form-control" id="password-confirm" name="confirm_password" autocomplete="new-password" required>' +
              '</div>' +
              '<div class="d-flex justify-content-end gap-3">' +
                '<button type="button" class="btn btn-light rd-btn-action border-0" data-bs-dismiss="modal">' +
                  '<i class="bi bi-x" aria-hidden="true"></i> Cancel' +
                '</button>' +
                '<button type="submit" class="btn btn-success rd-btn-action border-0">' +
                  '<i class="bi bi-check" aria-hidden="true"></i> Change password' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>' +
    '</div>';

  $('body').append(html);
}

function resetPasswordChangeForm() {
  var $form = $('#password-change-form');
  if (!$form.length) return;
  $form[0].reset();
  hideFormError('#password-change-form-error');
  $form.find('.form-control').each(function () {
    clearFieldError($(this));
  });
}

function initNavUserMenu() {
  if (!$('a.rd-nav-user').length) return;

  ensurePasswordChangeModal();

  $('a.rd-nav-user').each(function (idx) {
    var $link = $(this);
    if ($link.attr('data-bs-toggle') === 'dropdown') return;

    var $li = $link.closest('.nav-item');
    $li.addClass('dropdown');

    var toggleId = 'rd-nav-user-toggle-' + idx;
    $link
      .addClass('dropdown-toggle')
      .attr({
        id: toggleId,
        'data-bs-toggle': 'dropdown',
        role: 'button',
        'aria-expanded': 'false'
      })
      .on('click', function (e) {
        e.preventDefault();
      });

    var $menu = $(
      '<ul class="dropdown-menu dropdown-menu-end rd-nav-user-menu" aria-labelledby="' + toggleId + '">' +
        '<li>' +
          '<button type="button" class="dropdown-item js-open-password-change">' +
            '<i class="bi bi-key" aria-hidden="true"></i> Change Password' +
          '</button>' +
        '</li>' +
      '</ul>'
    );
    $li.append($menu);
  });

  $(document).on('click', '.js-open-password-change', function () {
    resetPasswordChangeForm();
    var el = document.getElementById('password-change-modal');
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
    $('body').removeClass('rd-sidebar-open');
  });

  $(document).on('submit', '#password-change-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');
    hideFormError('#password-change-form-error');

    var valid = true;
    var fields = [
      { id: 'password-current', msg: 'Please enter your current password.' },
      { id: 'password-new', msg: 'Please enter a new password.' },
      { id: 'password-confirm', msg: 'Please confirm your new password.' }
    ];

    for (var i = 0; i < fields.length; i++) {
      if (!validateRequired(fields[i].id, fields[i].msg)) valid = false;
    }

    var newPw = $('#password-new').val();
    var confirmPw = $('#password-confirm').val();
    if (valid && newPw.length < 8) {
      showFieldError($('#password-new'), 'Password must be at least 8 characters.');
      valid = false;
    }
    if (valid && newPw !== confirmPw) {
      showFieldError($('#password-confirm'), 'New passwords do not match.');
      valid = false;
    }

    if (!valid) {
      showFormError('#password-change-form-error', 'Please check your input.');
      return;
    }

    setButtonLoading($btn, true);
    setTimeout(function () {
      setButtonLoading($btn, false);
      var modalEl = document.getElementById('password-change-modal');
      if (modalEl) {
        var modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      resetPasswordChangeForm();
      showToast('Password changed successfully.', 'success');
    }, 800);
  });

  $(document).on('hidden.bs.modal', '#password-change-modal', resetPasswordChangeForm);
}

/* ============================================
   Toast Notification System
   ============================================ */
function showToast(message, type) {
  var iconMap = { success: 'bi-check-circle-fill', error: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
  var $container = $('#toast-container');
  if (!$container.length) {
    $('body').append('<div id="toast-container"></div>');
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
        location.href = './model_management.html';
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

  // --- Add Key Modal (teams / team management / userRole teams) ---
  $(document).on('submit', '#key-new-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('[type="submit"]');
    var keyName = ($('#key-name').val() || '').trim();
    if (!keyName) {
      showFieldError($('#key-name'), 'Key name is required');
      return;
    }
    clearFieldError($('#key-name'));

    var payload = {
      key_id: generateMockKeyId(),
      key_secret: generateMockKeySecret(),
      key_name: keyName,
      team_id: $('#key-new-team-id').val() || '',
      team_name: ($('#key-new-team-name').text() || '').trim()
    };

    setButtonLoading($btn, true);
    setTimeout(function () {
      var modalEl = document.getElementById('key-new-modal');
      if (modalEl) {
        var modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
      $form[0].reset();
      setButtonLoading($btn, false);
      handleKeyCreated(payload);
    }, 800);
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
   Sidebar drawer (narrow viewports) — merged account + nav
   ============================================ */
function getNavUserDisplayName($user) {
  var $clone = $user.clone();
  $clone.find('.rd-nav-user__badge, i').remove();
  return $clone.text().trim();
}

function ensureDrawerSectionLabel($sidebar) {
  if ($sidebar.find('.rd-sidebar__section-label--drawer-top').length) return;

  var $ul = $sidebar.children('ul').first();
  if (!$ul.length) return;

  var $firstLabel = $ul.children('.rd-sidebar__section-label').first();
  if (!$firstLabel.length) return;

  var $top = $('<div class="rd-sidebar__section-label rd-sidebar__section-label--drawer-top" role="presentation"></div>');
  $top.text($firstLabel.text().trim());
  $sidebar.prepend($top);
}

function buildSidebarAccountBlock($sidebar) {
  if ($sidebar.find('.rd-sidebar__account').length) return;

  var $user = $('.rd-navbar .rd-nav-user').first();
  if (!$user.length) return;

  var $logout = $('.rd-navbar .rd-nav-logout').first();
  var $badge = $user.find('.rd-nav-user__badge').first();
  var displayName = getNavUserDisplayName($user);
  var hasPassword = $user.attr('data-bs-toggle') === 'dropdown';

  var $block = $('<div class="rd-sidebar__account" role="region" aria-label="Account"></div>');

  var $header = $(
    '<button type="button" class="rd-sidebar__account-header" aria-expanded="false" aria-controls="rd-sidebar-account-actions">' +
    '<span class="rd-sidebar__account-chevron" aria-hidden="true"><i class="bi bi-chevron-down"></i></span>' +
    '</button>'
  );
  var $profile = $('<div class="rd-sidebar__account-profile"></div>');

  if ($badge.length) {
    $profile.append($badge.clone());
  }
  $profile.append('<i class="bi bi-person-circle" aria-hidden="true"></i>');
  if (displayName) {
    $profile.append($('<span class="rd-sidebar__account-name"></span>').text(displayName));
  }

  $header.prepend($profile);
  $block.append($header);

  if (hasPassword || $logout.length) {
    var $actions = $('<div class="rd-sidebar__account-actions" id="rd-sidebar-account-actions" hidden></div>');

    if (hasPassword) {
      $actions.append(
        '<button type="button" class="rd-sidebar__nav-action js-open-password-change">' +
        '<i class="bi bi-key" aria-hidden="true"></i> Change Password</button>'
      );
    }

    if ($logout.length) {
      var $logoutBtn = $('<a href="#" class="rd-sidebar__nav-action rd-sidebar__nav-action--logout"></a>');
      $logoutBtn.html($logout.html());
      $actions.append($logoutBtn);
    }

    $block.append($actions);
  } else {
    $header.find('.rd-sidebar__account-chevron').remove();
    $header.prop('disabled', true).removeAttr('aria-controls');
  }

  var $anchor = $sidebar.find('.rd-sidebar__section-label--drawer-top').first();
  if ($anchor.length) {
    $anchor.after($block);
  } else {
    $sidebar.prepend($block);
  }
}

function collapseSidebarAccount($sidebar) {
  var $acc = $sidebar.find('.rd-sidebar__account');
  $acc.removeClass('is-open');
  $acc.find('.rd-sidebar__account-header').attr('aria-expanded', 'false');
  $acc.find('.rd-sidebar__account-actions').attr('hidden', 'hidden');
}

function initSidebarToggle() {
  var $sidebar = $('.rd-sidebar').first();
  if (!$sidebar.length) return;

  if (!$sidebar.attr('id')) {
    $sidebar.attr('id', 'rd-sidebar');
  }

  ensureDrawerSectionLabel($sidebar);
  buildSidebarAccountBlock($sidebar);

  var $navbar = $('.rd-navbar').first();
  if (!$navbar.length) return;

  var drawerMq = window.matchMedia('(max-width: 991.98px)');

  function isDrawerMode() {
    return drawerMq.matches;
  }

  function setSidebarOpen(open) {
    $('body').toggleClass('rd-sidebar-open', open);
    $toggle.attr('aria-expanded', open ? 'true' : 'false');
    $toggle.attr('aria-label', open ? 'Close menu' : 'Open menu');
    $toggle.find('i').toggleClass('bi-list', !open).toggleClass('bi-x-lg', open);
    if (!open) collapseSidebarAccount($sidebar);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function toggleSidebar() {
    if (!isDrawerMode()) return;
    setSidebarOpen(!$('body').hasClass('rd-sidebar-open'));
  }

  var $toggle = $navbar.find('.rd-sidebar-toggle');
  if (!$toggle.length) {
    $toggle = $(
      '<button type="button" class="rd-sidebar-toggle border-0"' +
      ' aria-label="Open menu" aria-expanded="false" aria-controls="rd-sidebar">' +
      '<i class="bi bi-list" aria-hidden="true"></i></button>'
    );
    $navbar.prepend($toggle);
  } else {
    $navbar.prepend($toggle);
  }

  if (!$('.rd-sidebar-backdrop').length) {
    $('body').append('<div class="rd-sidebar-backdrop" aria-hidden="true"></div>');
  }

  $toggle.off('click.rdSidebar').on('click.rdSidebar', function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleSidebar();
  });

  $(document).off('click.rdSidebarBackdrop').on('click.rdSidebarBackdrop', '.rd-sidebar-backdrop', closeSidebar);

  $sidebar.off('click.rdSidebarAccount').on('click.rdSidebarAccount', '.rd-sidebar__account-header', function (e) {
    if (!$(this).find('.rd-sidebar__account-chevron').length) return;
    e.preventDefault();
    e.stopPropagation();
    var $acc = $(this).closest('.rd-sidebar__account');
    var open = !$acc.hasClass('is-open');
    $acc.toggleClass('is-open', open);
    $(this).attr('aria-expanded', open ? 'true' : 'false');
    var $actions = $acc.find('.rd-sidebar__account-actions');
    if (open) {
      $actions.removeAttr('hidden');
    } else {
      $actions.attr('hidden', 'hidden');
    }
  });

  $sidebar.off('click.rdSidebarNav').on('click.rdSidebarNav', '.nav-link, .rd-sidebar__nav-action--logout', function () {
    if (isDrawerMode()) closeSidebar();
  });

  $(document).off('keydown.rdSidebar').on('keydown.rdSidebar', function (e) {
    if (e.key === 'Escape' && $('body').hasClass('rd-sidebar-open')) {
      closeSidebar();
    }
  });

  if (drawerMq.addEventListener) {
    drawerMq.addEventListener('change', function () {
      if (!isDrawerMode()) closeSidebar();
    });
  } else if (drawerMq.addListener) {
    drawerMq.addListener(function () {
      if (!isDrawerMode()) closeSidebar();
    });
  }
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
  initAddRemoveActions();
  initDeployFormAddRemove();
  initNewKeyAlert();
  initModelManagement();
  initDestructiveModals();
  initFieldValidation();
  initFormSubmit();
  initFadeIn();
  initAdminHistoriesSearch();
  initMyHistoriesTable();
  initNavUserMenu();
  initTeamEditForm();
  initSidebarToggle();
});
