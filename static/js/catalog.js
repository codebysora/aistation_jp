/**
 * AIStation Dashboard - Model Catalog
 * Filtering, sorting, and multi-view rendering
 */

/* ============================================
   Sample Data
   ============================================ */
var CATALOG_DATA = [
  {
    id: "qwen3-235b",
    name: "Qwen3 235B A22B",
    provider: "Qwen",
    publisher_region: "chinese",
    modality: "text",
    source: "Qwen/Qwen3-235B-A22B",
    engine: ["vllm"],
    license: "Apache 2.0",
    interfaces: ["text"],
    capabilities: ["reasoning", "code", "multilingual"],
    use_cases: ["agent", "reasoning", "coding"],
    reasoning: true,
    context: 131072,
    size: "235B (MoE)",
    size_num: 235,
    benchmarks: { mmlu: 88.0, humaneval: 80.5, math: 82.3, mt_bench: 9.1 },
    released: "2025-04"
  },
  {
    id: "llama4-maverick",
    name: "Llama 4 Maverick",
    provider: "Meta",
    publisher_region: "western",
    modality: "text",
    source: "meta-llama/Llama-4-Maverick-17B-128E",
    engine: ["vllm", "ollama"],
    license: "Llama",
    interfaces: ["text", "vision"],
    capabilities: ["reasoning", "vision", "multilingual"],
    use_cases: ["agent", "multimodal", "reasoning"],
    reasoning: true,
    context: 1048576,
    size: "400B (MoE 128E)",
    size_num: 400,
    benchmarks: { mmlu: 85.5, humaneval: 73.2, math: 78.1, mt_bench: 8.8 },
    released: "2025-04"
  },
  {
    id: "gemma3-27b",
    name: "Gemma 3 27B",
    provider: "Google",
    publisher_region: "western",
    modality: "text",
    source: "google/gemma-3-27b-it",
    engine: ["vllm", "ollama"],
    license: "Gemma",
    interfaces: ["text", "vision"],
    capabilities: ["vision", "multilingual"],
    use_cases: ["multimodal", "chat"],
    reasoning: false,
    context: 131072,
    size: "27B",
    size_num: 27,
    benchmarks: { mmlu: 78.2, humaneval: 65.3, math: 68.5, mt_bench: 8.3 },
    released: "2025-03"
  },
  {
    id: "phi4-mini",
    name: "Phi-4 Mini 3.8B",
    provider: "Microsoft",
    publisher_region: "western",
    modality: "text",
    source: "microsoft/Phi-4-mini-instruct",
    engine: ["vllm", "ollama", "lmstudio"],
    license: "MIT",
    interfaces: ["text"],
    capabilities: ["code", "reasoning"],
    use_cases: ["lightweight", "coding"],
    reasoning: true,
    context: 131072,
    size: "3.8B",
    size_num: 3.8,
    benchmarks: { mmlu: 70.1, humaneval: 72.0, math: 71.5, mt_bench: 7.8 },
    released: "2025-02"
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3 0324",
    provider: "DeepSeek",
    publisher_region: "chinese",
    modality: "text",
    source: "deepseek-ai/DeepSeek-V3-0324",
    engine: ["vllm"],
    license: "MIT",
    interfaces: ["text"],
    capabilities: ["code", "math", "reasoning"],
    use_cases: ["reasoning", "coding"],
    reasoning: true,
    context: 131072,
    size: "685B (MoE)",
    size_num: 685,
    benchmarks: { mmlu: 87.5, humaneval: 85.0, math: 90.2, mt_bench: 9.0 },
    released: "2025-03"
  },
  {
    id: "mistral-medium3",
    name: "Mistral Medium 3",
    provider: "Mistral",
    publisher_region: "western",
    modality: "text",
    source: "mistralai/Mistral-Medium-3",
    engine: ["vllm"],
    license: "Apache 2.0",
    interfaces: ["text"],
    capabilities: ["multilingual", "code"],
    use_cases: ["chat", "coding"],
    reasoning: false,
    context: 131072,
    size: "73B",
    size_num: 73,
    benchmarks: { mmlu: 82.3, humaneval: 75.1, math: 74.8, mt_bench: 8.5 },
    released: "2025-04"
  },
  {
    id: "command-a",
    name: "Command A",
    provider: "Cohere",
    publisher_region: "western",
    modality: "text",
    source: "CohereForAI/c4ai-command-a-03-2025",
    engine: ["vllm"],
    license: "CC-BY-NC",
    interfaces: ["text"],
    capabilities: ["tool_use", "multilingual"],
    use_cases: ["agent", "chat"],
    reasoning: false,
    context: 262144,
    size: "111B (MoE)",
    size_num: 111,
    benchmarks: { mmlu: 80.5, humaneval: 68.2, math: 70.1, mt_bench: 8.4 },
    released: "2025-03"
  },
  {
    id: "glm4-32b",
    name: "GLM-4 32B",
    provider: "Zhipu",
    publisher_region: "chinese",
    modality: "text",
    source: "THUDM/GLM-4-32B-0414",
    engine: ["vllm", "ollama"],
    license: "MIT",
    interfaces: ["text"],
    capabilities: ["code", "tool_use", "reasoning"],
    use_cases: ["agent", "coding"],
    reasoning: true,
    context: 131072,
    size: "32B",
    size_num: 32,
    benchmarks: { mmlu: 81.8, humaneval: 78.3, math: 76.2, mt_bench: 8.6 },
    released: "2025-04"
  },
  {
    id: "qwen3-06b",
    name: "Qwen3 0.6B",
    provider: "Qwen",
    publisher_region: "chinese",
    modality: "text",
    source: "Qwen/Qwen3-0.6B",
    engine: ["vllm", "ollama", "lmstudio"],
    license: "Apache 2.0",
    interfaces: ["text"],
    capabilities: [],
    use_cases: ["lightweight", "chat"],
    reasoning: false,
    context: 32768,
    size: "0.6B",
    size_num: 0.6,
    benchmarks: { mmlu: 42.1, humaneval: 35.5, math: 30.2, mt_bench: 5.5 },
    released: "2025-04"
  },
  {
    id: "smollm2-17b",
    name: "SmolLM2 1.7B",
    provider: "HuggingFace",
    publisher_region: "western",
    modality: "text",
    source: "HuggingFaceTB/SmolLM2-1.7B-Instruct",
    engine: ["ollama", "lmstudio"],
    license: "Apache 2.0",
    interfaces: ["text"],
    capabilities: [],
    use_cases: ["lightweight", "chat"],
    reasoning: false,
    context: 8192,
    size: "1.7B",
    size_num: 1.7,
    benchmarks: { mmlu: 48.5, humaneval: 40.2, math: 35.1, mt_bench: 6.0 },
    released: "2025-01"
  },
  {
    id: "qwen3-32b",
    name: "Qwen3 32B",
    provider: "Qwen",
    publisher_region: "chinese",
    modality: "text",
    source: "Qwen/Qwen3-32B",
    engine: ["vllm", "ollama"],
    license: "Apache 2.0",
    interfaces: ["text"],
    capabilities: ["reasoning", "code", "multilingual"],
    use_cases: ["agent", "coding"],
    reasoning: true,
    context: 131072,
    size: "32B",
    size_num: 32,
    benchmarks: { mmlu: 84.2, humaneval: 79.8, math: 80.1, mt_bench: 8.9 },
    released: "2025-04"
  },
  {
    id: "llama4-scout",
    name: "Llama 4 Scout",
    provider: "Meta",
    publisher_region: "western",
    modality: "text",
    source: "meta-llama/Llama-4-Scout-17B-16E",
    engine: ["vllm", "ollama"],
    license: "Llama",
    interfaces: ["text", "vision"],
    capabilities: ["vision", "multilingual"],
    use_cases: ["multimodal", "chat"],
    reasoning: false,
    context: 524288,
    size: "109B (MoE 16E)",
    size_num: 109,
    benchmarks: { mmlu: 79.8, humaneval: 67.0, math: 71.3, mt_bench: 8.2 },
    released: "2025-04"
  },

  /* ===== Embeddings models ===== */
  {
    id: "bge-large-en-v15",
    name: "BGE Large EN v1.5",
    provider: "BAAI",
    publisher_region: "chinese",
    modality: "embeddings",
    source: "BAAI/bge-large-en-v1.5",
    engine: ["vllm"],
    license: "MIT",
    interfaces: ["text"],
    capabilities: ["multilingual"],
    use_cases: ["retrieval"],
    reasoning: false,
    context: 512,
    size: "335M",
    size_num: 0.335,
    embedding_dim: 1024,
    benchmarks: { mteb: 64.2, retrieval: 54.3, classification: 75.9 },
    released: "2024-09"
  },
  {
    id: "e5-large-v2",
    name: "E5 Large v2",
    provider: "Microsoft",
    publisher_region: "western",
    modality: "embeddings",
    source: "intfloat/e5-large-v2",
    engine: ["vllm"],
    license: "MIT",
    interfaces: ["text"],
    capabilities: ["multilingual"],
    use_cases: ["retrieval"],
    reasoning: false,
    context: 512,
    size: "335M",
    size_num: 0.335,
    embedding_dim: 1024,
    benchmarks: { mteb: 62.3, retrieval: 52.1, classification: 74.8 },
    released: "2024-05"
  },
  {
    id: "qwen3-embedding-8b",
    name: "Qwen3 Embedding 8B",
    provider: "Qwen",
    publisher_region: "chinese",
    modality: "embeddings",
    source: "Qwen/Qwen3-Embedding-8B",
    engine: ["vllm"],
    license: "Apache 2.0",
    interfaces: ["text"],
    capabilities: ["multilingual"],
    use_cases: ["retrieval", "multilingual"],
    reasoning: false,
    context: 32768,
    size: "8B",
    size_num: 8,
    embedding_dim: 4096,
    benchmarks: { mteb: 70.6, retrieval: 60.5, classification: 80.1 },
    released: "2025-06"
  },
  // Deployment preset entry (from preset.json) — CPU-only variant
  {
    id: "qwen3-0.6b-cpu",
    name: "qwen3-0.6b-cpu",
    provider: "Qwen",
    publisher_region: "chinese",
    modality: "text",
    source: "Qwen/Qwen3-0.6B",
    engine: ["vllm"],
    license: "Apache 2.0",
    interfaces: ["text"],
    capabilities: ["reasoning"],
    use_cases: ["lightweight", "reasoning"],
    reasoning: true,
    context: 4096,
    size: "0.6B",
    size_num: 0.6,
    benchmarks: { mmlu: 52.3, humaneval: 38.5, math: 40.2, mt_bench: 6.8 },
    released: "2025-04"
  }
];

/* ============================================
   State
   ============================================ */
var catalogState = {
  view: 'card',
  sort: 'name',
  search: '',
  expandedId: null,
  modality: 'text',
  filters: {
    interfaces: [],
    capability: [],
    license: [],
    publisher_region: [],
    context: 0,
    size: 0
  }
};

/** Deploy model select uses preset.json metrics (Int / Cod / Mat / Spd / TTFT). */
var isDeployMode = typeof location !== 'undefined' &&
  location.pathname.indexOf('deploy_model_select') !== -1;

/** Set true on deploy_model_select.html — benchmarks come only from preset.json. */
function catalogUsesPresetBenchmarks() {
  return !!(window.CATALOG_USE_PRESET_BENCHMARKS || isDeployMode);
}

/** Column defs for preset.json → UI (matches card view bar labels). */
var PRESET_BENCH_COLUMNS = [
  { key: 'int', label: 'Int' },
  { key: 'cod', label: 'Cod' },
  { key: 'mat', label: 'Mat' },
  { key: 'spd', label: 'Spd' },
  { key: 'ttft', label: 'TTFT' }
];

var CONTEXT_STEPS = [0, 4096, 8192, 32768, 131072, 1048576];
var CONTEXT_LABELS = ['All', '4K', '8K', '32K', '128K', '1M+'];
var SIZE_STEPS = [0, 3, 13, 70, 9999];
var SIZE_LABELS = ['All', '<3B', '3-13B', '13-70B', '70B+'];

/* ============================================
   Helpers
   ============================================ */
function formatContext(ctx) {
  if (ctx >= 1048576) return (ctx / 1048576).toFixed(0) + 'M';
  if (ctx >= 1024) return (ctx / 1024).toFixed(0) + 'K';
  return ctx.toString();
}

function benchmarkColor(score) {
  if (score >= 80) return 'var(--bs-success)';
  if (score >= 60) return 'var(--bs-primary)';
  if (score >= 40) return 'var(--bs-warning)';
  return 'var(--bs-danger)';
}

function benchmarkColorClass(score) {
  if (score >= 80) return 'catalog-score--high';
  if (score >= 60) return 'catalog-score--mid';
  if (score >= 40) return 'catalog-score--low';
  return 'catalog-score--vlow';
}

function capabilityIcon(cap) {
  var icons = {
    reasoning: 'bi-lightbulb',
    code: 'bi-code-slash',
    vision: 'bi-eye',
    multilingual: 'bi-translate',
    tool_use: 'bi-tools',
    math: 'bi-calculator'
  };
  return icons[cap] || 'bi-tag';
}

function capabilityLabel(cap) {
  var labels = {
    reasoning: 'Reasoning',
    code: 'Code',
    vision: 'Vision',
    multilingual: 'Multilingual',
    tool_use: 'Tool Use',
    math: 'Math'
  };
  return labels[cap] || cap;
}

function useCaseLabel(uc) {
  var labels = {
    chat: 'チャット向け',
    agent: 'エージェント向け',
    coding: 'コーディング向け',
    reasoning: '推論向け',
    multimodal: 'マルチモーダル向け',
    lightweight: '軽量向け'
  };
  return labels[uc] || uc;
}

function useCaseIcon(uc) {
  var icons = {
    chat: 'bi-chat-dots',
    agent: 'bi-robot',
    coding: 'bi-code-square',
    reasoning: 'bi-lightbulb',
    multimodal: 'bi-image',
    lightweight: 'bi-lightning-charge',
    retrieval: 'bi-search',
    multilingual: 'bi-translate'
  };
  return icons[uc] || 'bi-tag';
}

/* Use-case tags that duplicate info already shown elsewhere on the card.
   `coding` is conveyed by the HumanEval (Code) score; `lightweight` is
   conveyed by the model size. Hide them on the card to reduce noise.
   NOTE: 2026-04-30 以降、カード上の usecase 表示自体を廃止（数値比較に置換）。
   この定数は list/modal 等の他ビューで参照されるため残置。 */
var REDUNDANT_USECASES_ON_CARD = { coding: 1, lightweight: 1 };

/* Modality icon mapping (Proposal D). Keys are canonical modality slugs,
   values are Bootstrap Icons class names. */
var MODALITY_ICONS = {
  text: 'bi-fonts',
  vision: 'bi-image',
  image: 'bi-image',
  image_gen: 'bi-image',
  audio: 'bi-soundwave',
  video: 'bi-camera-reels',
  embeddings: 'bi-bezier2'
};

function modalityIcon(slug) {
  return MODALITY_ICONS[slug] || 'bi-circle';
}

function modalityLabel(slug) {
  var labels = {
    text: 'Text', vision: 'Image', image: 'Image', image_gen: 'Image',
    audio: 'Audio', video: 'Video', embeddings: 'Embeddings'
  };
  return labels[slug] || slug;
}

/* Resolve input/output modality lists for a model.
   - Input: `m.input_interfaces` if set, else `m.interfaces` (existing field).
   - Output: `m.output_interfaces` if set, else inferred from `m.modality`
     (embeddings → ['embeddings'], everything else defaults to ['text']). */
function getInputModalities(m) {
  if (m.input_interfaces && m.input_interfaces.length) return m.input_interfaces;
  if (m.interfaces && m.interfaces.length) return m.interfaces;
  return ['text'];
}

function getOutputModalities(m) {
  if (m.output_interfaces && m.output_interfaces.length) return m.output_interfaces;
  if ((m.modality || 'text') === 'embeddings') return ['embeddings'];
  return ['text'];
}

/* =========================================================================
   Metrics row (provisional)
   -------------------------------------------------------------------------
   usecase 行の跡地に置く数値ハイライト。先方が共有するサンプル
   (jinja2 テンプレ + プリセット) の指標が確定したら、ここを差し替える前提。

   現状の暫定ロジック:
   - text モデル → 利用可能な benchmark のうち最高値を `TOP: <label> <score>`
   - embeddings モデル → embedding_dim を `DIM: <n>`
   いずれも空配列ならコンテナごと :empty で非表示。
   ========================================================================= */
function getCardMetrics(m) {
  var metrics = [];
  if ((m.modality || 'text') === 'embeddings') {
    if (m.embedding_dim) {
      metrics.push({ label: 'DIM', value: String(m.embedding_dim) });
    }
    return metrics;
  }
  if (m.benchmarks) {
    var keys = ['mmlu', 'humaneval', 'math', 'mt_bench'];
    var labels = { mmlu: 'MMLU', humaneval: 'Code', math: 'Math', mt_bench: 'MT' };
    var best = null;
    for (var i = 0; i < keys.length; i++) {
      var v = m.benchmarks[keys[i]];
      if (typeof v !== 'number') continue;
      if (!best || v > best.value) best = { label: labels[keys[i]], value: v };
    }
    if (best) {
      metrics.push({ label: 'TOP', value: best.label + ' ' + best.value.toFixed(1), highlight: true });
    }
  }
  return metrics;
}

function renderMetricsRow(m) {
  var metrics = getCardMetrics(m);
  if (!metrics.length) return '<div class="catalog-card__metrics"></div>';
  var html = '<div class="catalog-card__metrics">';
  for (var i = 0; i < metrics.length; i++) {
    var cls = 'catalog-metric' + (metrics[i].highlight ? ' catalog-metric--top' : '');
    html += '<span class="' + cls + '">';
    html += '<span class="catalog-metric__label">' + escapeHtml(metrics[i].label) + '</span>';
    html += '<span class="catalog-metric__value">' + escapeHtml(metrics[i].value) + '</span>';
    html += '</span>';
  }
  html += '</div>';
  return html;
}

/* Render the IN→OUT modality group used on cards (Proposal D). */
function renderModalityGroup(m) {
  var ins = getInputModalities(m);
  var outs = getOutputModalities(m);
  var inLabel = ins.map(modalityLabel).join(', ');
  var outLabel = outs.map(modalityLabel).join(', ');
  var html = '<span class="pd-mod-group" title="Input: ' + inLabel + ' → Output: ' + outLabel + '">';
  html += '<span class="pd-mod-group__label">IN</span>';
  for (var i = 0; i < ins.length; i++) {
    html += '<i class="bi ' + modalityIcon(ins[i]) + '" title="' + modalityLabel(ins[i]) + '"></i>';
  }
  html += '<span class="pd-mod-group__arrow"><i class="bi bi-arrow-right"></i></span>';
  html += '<span class="pd-mod-group__label">OUT</span>';
  for (var j = 0; j < outs.length; j++) {
    html += '<i class="bi ' + modalityIcon(outs[j]) + '" title="' + modalityLabel(outs[j]) + '"></i>';
  }
  html += '</span>';
  return html;
}

function providerSlug(provider) {
  return String(provider || '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function publisherRegionLabel(region) {
  var labels = { western: 'Western', chinese: 'Chinese', other: 'Other' };
  return labels[region] || region;
}

/* ============================================
   Filtering
   ============================================ */
function filterModels(data) {
  var f = catalogState.filters;
  var q = catalogState.search.toLowerCase();
  var modality = catalogState.modality;

  return data.filter(function (m) {
    // Top-level modality (text / embeddings)
    if (modality && (m.modality || 'text') !== modality) return false;

    // Text search
    if (q && m.name.toLowerCase().indexOf(q) === -1 &&
        m.provider.toLowerCase().indexOf(q) === -1 &&
        m.source.toLowerCase().indexOf(q) === -1) {
      return false;
    }

    // Interfaces: if any checked, model must have at least one
    if (f.interfaces.length > 0) {
      var hasInterface = false;
      for (var i = 0; i < f.interfaces.length; i++) {
        if (m.interfaces.indexOf(f.interfaces[i]) !== -1) { hasInterface = true; break; }
      }
      if (!hasInterface) return false;
    }

    // Capabilities: model must have ALL checked capabilities
    for (var c = 0; c < f.capability.length; c++) {
      if (f.capability[c] === 'vision') {
        if (m.interfaces.indexOf('vision') === -1 && m.capabilities.indexOf('vision') === -1) return false;
      } else {
        if (m.capabilities.indexOf(f.capability[c]) === -1) return false;
      }
    }

    // License: if any checked, model must match one
    if (f.license.length > 0) {
      if (f.license.indexOf(m.license) === -1) return false;
    }

    // Publisher region: if any checked, model must match one
    if (f.publisher_region.length > 0) {
      if (f.publisher_region.indexOf(m.publisher_region || 'other') === -1) return false;
    }

    // Context: minimum context window
    var ctxMin = CONTEXT_STEPS[f.context];
    if (ctxMin > 0 && m.context < ctxMin) return false;

    // Size: filter by range
    if (f.size > 0) {
      var sMin = SIZE_STEPS[f.size - 1];
      var sMax = SIZE_STEPS[f.size];
      if (m.size_num < sMin || m.size_num >= sMax) return false;
    }

    return true;
  });
}

/* ============================================
   Preset benchmarks (Artificial Analysis — deploy model select)
   ============================================ */
function getModelPreset(m) {
  return m && m._preset ? m._preset : null;
}

/** Map preset.json perf fields to catalog benchmark keys (display + sort). */
function benchmarksFromPreset(p) {
  if (!p) return {};
  return {
    int: p.intelligence_index != null ? p.intelligence_index : null,
    cod: p.coding_index != null ? p.coding_index : null,
    mat: p.math_index != null ? p.math_index : null,
    spd: p.median_output_tokens_per_second != null ? p.median_output_tokens_per_second : null,
    ttft: p.ttft != null ? p.ttft : null
  };
}

function appendPresetBenchHeaders(html) {
  for (var i = 0; i < PRESET_BENCH_COLUMNS.length; i++) {
    html += '<th class="catalog-list-th catalog-list-th--bench">' + PRESET_BENCH_COLUMNS[i].label + '</th>';
  }
  return html;
}

/** Deploy CTA — matches admin pages (btn-dark rd-btn-action). */
function catalogDeployButtonHtml(modelId, small, label) {
  var href = './deploy_model_form.html?model=' + encodeURIComponent(modelId);
  var cls = small
    ? 'btn btn-sm btn-dark rd-btn-action border-0 text-decoration-none'
    : 'btn btn-dark rd-btn-action border-0 text-decoration-none';
  var text = label || 'Deploy';
  return '<a href="' + href + '" class="' + cls + '" onclick="event.stopPropagation()">' +
    '<i class="bi bi-rocket-takeoff" aria-hidden="true"></i> ' + escapeHtml(text) + '</a>';
}

function presetMetricValue(p, key) {
  if (!p) return null;
  switch (key) {
    case 'int': return p.intelligence_index;
    case 'cod': return p.coding_index;
    case 'mat': return p.math_index;
    case 'spd': return p.median_output_tokens_per_second;
    case 'ttft': return p.ttft;
    default: return null;
  }
}

function presetSortComparable(p, key, opts) {
  opts = opts || {};
  if (!p) return opts.missing;
  var v = presetMetricValue(p, key);
  if (v == null) return opts.missing;
  if (opts.zeroMissing && v === 0) return opts.missing;
  return v;
}

function comparePresetSort(a, b, sortKey) {
  var pa = getModelPreset(a);
  var pb = getModelPreset(b);
  var MISSING_LOW = -Infinity;
  var MISSING_HIGH = Infinity;

  switch (sortKey) {
    case 'name': return a.name.localeCompare(b.name);
    case 'context_desc': return (b.context || 0) - (a.context || 0);
    case 'released_desc': return (b.released || '').localeCompare(a.released || '');
    case 'int_desc':
      return presetSortComparable(pb, 'int', { missing: MISSING_LOW }) -
        presetSortComparable(pa, 'int', { missing: MISSING_LOW });
    case 'cod_desc':
      return presetSortComparable(pb, 'cod', { missing: MISSING_LOW }) -
        presetSortComparable(pa, 'cod', { missing: MISSING_LOW });
    case 'mat_desc':
      return presetSortComparable(pb, 'mat', { missing: MISSING_LOW }) -
        presetSortComparable(pa, 'mat', { missing: MISSING_LOW });
    case 'spd_desc':
      return presetSortComparable(pb, 'spd', { missing: MISSING_LOW, zeroMissing: true }) -
        presetSortComparable(pa, 'spd', { missing: MISSING_LOW, zeroMissing: true });
    case 'ttft_asc':
      return presetSortComparable(pa, 'ttft', { missing: MISSING_HIGH, zeroMissing: true }) -
        presetSortComparable(pb, 'ttft', { missing: MISSING_HIGH, zeroMissing: true });
    default: return 0;
  }
}

function fmtPresetScore(v) {
  if (v == null) return '';
  if (Math.abs(v) >= 100) return v.toFixed(0);
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

function renderPresetBarRow(label, value, maxVal, opts) {
  opts = opts || {};
  if (value == null) return '';
  if (opts.zeroIsUnmeasured && value === 0) {
    return '<div class="catalog-bench-row">' +
      '<span class="catalog-bench-row__label">' + escapeHtml(label) + '</span>' +
      '<span class="catalog-bench-row__bar"></span>' +
      '<span class="catalog-bench-row__score catalog-bench-row__score--unmeasured catalog-unmeasured-label">未計測</span>' +
      '</div>';
  }
  var pct = Math.max(0, Math.min(100, (value / maxVal) * 100));
  return '<div class="catalog-bench-row">' +
    '<span class="catalog-bench-row__label">' + escapeHtml(label) + '</span>' +
    '<span class="catalog-bench-row__bar"><span class="catalog-bench-row__fill" style="width:' + pct +
    '%;background:' + benchmarkColor(pct) + '"></span></span>' +
    '<span class="catalog-bench-row__score">' + fmtPresetScore(value) + '</span>' +
    '</div>';
}

function renderPresetTtftRow(value) {
  if (value == null) return '';
  var html = '<div class="catalog-bench-row catalog-bench-row--ttft">';
  html += '<span class="catalog-bench-row__label">TTFT</span>';
  if (value === 0) {
    html += '<span class="catalog-ttft-chip catalog-ttft-chip--unmeasured catalog-unmeasured-label" title="TTFT (Time to First Token) — 未計測">' +
      '<i class="bi bi-stopwatch"></i> 未計測</span>';
  } else {
    var cls, icon;
    if (value <= 1) { cls = 'catalog-ttft-chip--fast'; icon = 'bi-lightning-charge-fill'; }
    else if (value <= 3) { cls = 'catalog-ttft-chip--med'; icon = 'bi-stopwatch'; }
    else { cls = 'catalog-ttft-chip--slow'; icon = 'bi-hourglass-split'; }
    html += '<span class="catalog-ttft-chip ' + cls + '" title="TTFT (Time to First Token)">' +
      '<i class="bi ' + icon + '"></i> ' + value.toFixed(2) + 's</span>';
  }
  html += '</div>';
  return html;
}

function renderPresetScoreList(p) {
  if (!p) return '';
  var html = '<div class="catalog-card__benchmarks">';
  html += renderPresetBarRow('Int', p.intelligence_index, 20);
  html += renderPresetBarRow('Cod', p.coding_index, 20);
  html += renderPresetBarRow('Mat', p.math_index, 20);
  html += renderPresetBarRow('Spd', p.median_output_tokens_per_second, 400, { zeroIsUnmeasured: true });
  html += renderPresetTtftRow(p.ttft);
  html += '</div>';
  return html;
}

function formatPresetBenchTableCell(p, key) {
  if (!p) return '<span class="text-muted">—</span>';
  if (key === 'ttft') {
    var ttft = p.ttft;
    if (ttft == null || ttft === 0) return '<span class="catalog-unmeasured-label">未計測</span>';
    return '<span>' + ttft.toFixed(2) + 's</span>';
  }
  if (key === 'spd') {
    var spd = p.median_output_tokens_per_second;
    if (spd == null || spd === 0) return '<span class="catalog-unmeasured-label">未計測</span>';
    return '<span class="' + benchmarkColorClass(Math.min((spd / 400) * 100, 100)) + '">' + fmtPresetScore(spd) + '</span>';
  }
  var v = presetMetricValue(p, key);
  if (v == null) return '<span class="text-muted">—</span>';
  var pct = Math.min((v / 20) * 100, 100);
  return '<span class="' + benchmarkColorClass(pct) + '">' + fmtPresetScore(v) + '</span>';
}

/* ============================================
   Sorting
   ============================================ */
function sortModels(data) {
  var s = catalogState.sort;
  var sorted = data.slice();
  sorted.sort(function (a, b) {
    if (catalogUsesPresetBenchmarks()) {
      return comparePresetSort(a, b, s);
    }
    switch (s) {
      case 'name': return a.name.localeCompare(b.name);
      case 'size_desc': return b.size_num - a.size_num;
      case 'size_asc': return a.size_num - b.size_num;
      case 'context_desc': return b.context - a.context;
      case 'mmlu_desc': return (b.benchmarks.mmlu || 0) - (a.benchmarks.mmlu || 0);
      case 'humaneval_desc': return (b.benchmarks.humaneval || 0) - (a.benchmarks.humaneval || 0);
      case 'math_desc': return (b.benchmarks.math || 0) - (a.benchmarks.math || 0);
      case 'released_desc': return b.released.localeCompare(a.released);
      default: return 0;
    }
  });
  return sorted;
}

/* ============================================
   Renderers
   ============================================ */

// --- Card View (beginner-friendly) ---
function renderCardView(models) {
  if (models.length === 0) return '<div class="catalog-empty"><i class="bi bi-inbox"></i><p>No models match your filters</p></div>';

  var html = '<div class="catalog-card-grid">';
  for (var i = 0; i < models.length; i++) {
    var m = models[i];
    html += '<div class="catalog-card" data-model-id="' + m.id + '">';

    // Header (provider icon + name + provider)
    var slug = providerSlug(m.provider);
    html += '<div class="catalog-card__header">';
    html += '<img class="catalog-card__provider-icon" src="./static/img/providers/' + slug + '.svg" alt="" aria-hidden="true" onerror="this.style.visibility=\'hidden\'">';
    html += '<div class="catalog-card__heading">';
    html += '<div class="catalog-card__name">' + escapeHtml(m.name) + '</div>';
    if (m.source) {
      html += '<div class="catalog-card__source">' + escapeHtml(m.source) + '</div>';
    } else {
      html += '<div class="catalog-card__provider">' + escapeHtml(m.provider) + '</div>';
    }
    html += '</div>';
    html += '</div>';

    // Use-case tags removed — see docs/model_select_feedback_response.md (2026-04-30 update).
    // 数値比較を主軸にするため、カード上の usecase ラベルは廃止。
    // 跡地は `.catalog-card__metrics` (空コンテナ) としてサンプル受領後の差し替えに備える。
    html += renderMetricsRow(m);

    // Meta — fixed above benchmarks (modality / size / context)
    html += '<div class="catalog-card__meta">';
    html += renderModalityGroup(m);
    html += '<span class="catalog-tag catalog-tag--neutral catalog-tag--size">' + escapeHtml(m.size) + '</span>';
    html += '<span class="catalog-tag catalog-tag--neutral catalog-tag--context">' + formatContext(m.context) + ' ctx</span>';
    html += '</div>';

    // Benchmark bars — preset.json on deploy select; sample CATALOG_DATA elsewhere
    var preset = getModelPreset(m);
    if (preset) {
      html += renderPresetScoreList(preset);
    } else {
      html += '<div class="catalog-card__benchmarks">';
      var benchmarks;
      if ((m.modality || 'text') === 'embeddings') {
        benchmarks = [
          { key: 'mteb', label: 'MTEB' },
          { key: 'retrieval', label: 'Retr.' },
          { key: 'classification', label: 'Class.' }
        ];
      } else {
        benchmarks = [
          { key: 'mmlu', label: 'MMLU' },
          { key: 'humaneval', label: 'Code' },
          { key: 'math', label: 'Math' }
        ];
      }
      for (var b = 0; b < benchmarks.length; b++) {
        var score = m.benchmarks[benchmarks[b].key];
        if (typeof score !== 'number') continue;
        var pct = Math.min(score, 100);
        html += '<div class="catalog-bench-row">';
        html += '<span class="catalog-bench-row__label">' + benchmarks[b].label + '</span>';
        html += '<span class="catalog-bench-row__bar"><span class="catalog-bench-row__fill" style="width:' + pct + '%;background:' + benchmarkColor(score) + '"></span></span>';
        html += '<span class="catalog-bench-row__score">' + score.toFixed(1) + '</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    if (m.capabilities.length > 0) {
      html += '<div class="catalog-card__footer">';
      html += '<div class="catalog-card__caps">';
      for (var ci = 0; ci < m.capabilities.length; ci++) {
        html += '<span class="catalog-cap-badge" title="' + capabilityLabel(m.capabilities[ci]) + '">';
        html += '<i class="bi ' + capabilityIcon(m.capabilities[ci]) + '"></i>';
        html += '</span>';
      }
      html += '</div>';
      html += '</div>';
    }

    html += '</div>';
  }
  html += '</div>';
  return html;
}

// --- List View (intermediate, table-based comparison) ---
function renderListView(models) {
  if (models.length === 0) return '<div class="catalog-empty"><i class="bi bi-inbox"></i><p>No models match your filters</p></div>';

  var html = '<div class="catalog-list-wrap"><table class="catalog-list-table">';
  html += '<thead><tr>';
  html += '<th class="catalog-list-th">Model</th>';
  html += '<th class="catalog-list-th">Provider</th>';
  html += '<th class="catalog-list-th">Size</th>';
  html += '<th class="catalog-list-th">Context</th>';
  if (catalogUsesPresetBenchmarks()) {
    html = appendPresetBenchHeaders(html);
  } else {
    html += '<th class="catalog-list-th catalog-list-th--bench">MMLU</th>';
    html += '<th class="catalog-list-th catalog-list-th--bench">HumanEval</th>';
    html += '<th class="catalog-list-th catalog-list-th--bench">MATH</th>';
    html += '<th class="catalog-list-th catalog-list-th--bench">MT-Bench</th>';
  }
  html += '<th class="catalog-list-th">License</th>';
  if (catalogUsesPresetBenchmarks()) html += '<th class="catalog-list-th"></th>';
  html += '</tr></thead><tbody>';

  for (var i = 0; i < models.length; i++) {
    var m = models[i];
    var preset = getModelPreset(m);
    html += '<tr class="catalog-list-row" data-model-id="' + m.id + '">';
    html += '<td class="catalog-list-td"><span class="catalog-list-name">' + escapeHtml(m.name) + '</span>';

    // Use-case tags inline
    if (m.use_cases && m.use_cases.length > 0) {
      html += '<span class="catalog-list-usecases">';
      for (var u = 0; u < m.use_cases.length; u++) {
        var uc = m.use_cases[u];
        html += '<span class="catalog-tag catalog-tag--usecase catalog-tag--usecase-sm catalog-tag--usecase-' + uc + '">';
        html += '<i class="bi ' + useCaseIcon(uc) + '"></i> ' + useCaseLabel(uc);
        html += '</span>';
      }
      html += '</span>';
    }

    // Capability icons inline
    if (m.capabilities.length > 0) {
      html += '<span class="catalog-list-caps">';
      for (var ci = 0; ci < m.capabilities.length; ci++) {
        html += '<i class="bi ' + capabilityIcon(m.capabilities[ci]) + '" title="' + capabilityLabel(m.capabilities[ci]) + '"></i>';
      }
      html += '</span>';
    }
    html += '</td>';

    html += '<td class="catalog-list-td">' + escapeHtml(m.provider) + '</td>';
    html += '<td class="catalog-list-td"><span class="catalog-tag catalog-tag--size-sm">' + escapeHtml(m.size) + '</span></td>';
    html += '<td class="catalog-list-td">' + formatContext(m.context) + '</td>';

    if (catalogUsesPresetBenchmarks()) {
      for (var pb = 0; pb < PRESET_BENCH_COLUMNS.length; pb++) {
        html += '<td class="catalog-list-td catalog-list-td--bench">' +
          formatPresetBenchTableCell(preset, PRESET_BENCH_COLUMNS[pb].key) + '</td>';
      }
    } else {
      var isEmb = (m.modality || 'text') === 'embeddings';
      var benchKeys = isEmb
        ? ['mteb', 'retrieval', 'classification', null]
        : ['mmlu', 'humaneval', 'math', 'mt_bench'];
      for (var b = 0; b < benchKeys.length; b++) {
        var key = benchKeys[b];
        var score = key ? m.benchmarks[key] : undefined;
        if (typeof score === 'number') {
          var cls = benchmarkColorClass(score);
          html += '<td class="catalog-list-td catalog-list-td--bench"><span class="' + cls + '">' + score.toFixed(1) + '</span></td>';
        } else {
          html += '<td class="catalog-list-td catalog-list-td--bench"><span class="text-muted">—</span></td>';
        }
      }
    }

    html += '<td class="catalog-list-td"><span class="catalog-tag catalog-tag--license">' + escapeHtml(m.license) + '</span></td>';
    if (catalogUsesPresetBenchmarks()) {
      html += '<td class="catalog-list-td">' + catalogDeployButtonHtml(m.id, true) + '</td>';
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  return html;
}

// --- Detail View (advanced, expandable rows) ---
function renderDetailView(models) {
  if (models.length === 0) return '<div class="catalog-empty"><i class="bi bi-inbox"></i><p>No models match your filters</p></div>';

  var html = '<div class="catalog-list-wrap"><table class="catalog-list-table catalog-detail-table">';
  html += '<thead><tr>';
  html += '<th class="catalog-list-th catalog-list-th--chevron"></th>';
  html += '<th class="catalog-list-th">Model</th>';
  html += '<th class="catalog-list-th">Provider</th>';
  html += '<th class="catalog-list-th">Size</th>';
  html += '<th class="catalog-list-th">Context</th>';
  if (catalogUsesPresetBenchmarks()) {
    html = appendPresetBenchHeaders(html);
  } else {
    html += '<th class="catalog-list-th catalog-list-th--bench">MMLU</th>';
    html += '<th class="catalog-list-th catalog-list-th--bench">HumanEval</th>';
    html += '<th class="catalog-list-th catalog-list-th--bench">MATH</th>';
    html += '<th class="catalog-list-th catalog-list-th--bench">MT-Bench</th>';
  }
  html += '<th class="catalog-list-th">License</th>';
  if (catalogUsesPresetBenchmarks()) html += '<th class="catalog-list-th"></th>';
  html += '</tr></thead><tbody>';

  for (var i = 0; i < models.length; i++) {
    var m = models[i];
    var isExpanded = catalogState.expandedId === m.id;
    var preset = getModelPreset(m);

    // Summary row
    html += '<tr class="catalog-detail-row' + (isExpanded ? ' catalog-detail-row--expanded' : '') + '" data-model-id="' + m.id + '">';
    html += '<td class="catalog-list-td catalog-detail-chevron"><i class="bi ' + (isExpanded ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i></td>';
    html += '<td class="catalog-list-td"><span class="catalog-list-name">' + escapeHtml(m.name) + '</span>';
    if (m.use_cases && m.use_cases.length > 0) {
      html += '<span class="catalog-list-usecases">';
      for (var u = 0; u < m.use_cases.length; u++) {
        var uc = m.use_cases[u];
        html += '<span class="catalog-tag catalog-tag--usecase catalog-tag--usecase-sm catalog-tag--usecase-' + uc + '">';
        html += '<i class="bi ' + useCaseIcon(uc) + '"></i> ' + useCaseLabel(uc);
        html += '</span>';
      }
      html += '</span>';
    }
    html += '</td>';
    html += '<td class="catalog-list-td">' + escapeHtml(m.provider) + '</td>';
    html += '<td class="catalog-list-td"><span class="catalog-tag catalog-tag--size-sm">' + escapeHtml(m.size) + '</span></td>';
    html += '<td class="catalog-list-td">' + formatContext(m.context) + '</td>';

    if (catalogUsesPresetBenchmarks()) {
      for (var pb = 0; pb < PRESET_BENCH_COLUMNS.length; pb++) {
        html += '<td class="catalog-list-td catalog-list-td--bench">' +
          formatPresetBenchTableCell(preset, PRESET_BENCH_COLUMNS[pb].key) + '</td>';
      }
    } else {
      var dvIsEmb = (m.modality || 'text') === 'embeddings';
      var dvBenchKeys = dvIsEmb
        ? ['mteb', 'retrieval', 'classification', null]
        : ['mmlu', 'humaneval', 'math', 'mt_bench'];
      for (var b = 0; b < dvBenchKeys.length; b++) {
        var dvKey = dvBenchKeys[b];
        var dvScore = dvKey ? m.benchmarks[dvKey] : undefined;
        if (typeof dvScore === 'number') {
          var dvCls = benchmarkColorClass(dvScore);
          html += '<td class="catalog-list-td catalog-list-td--bench"><span class="' + dvCls + '">' + dvScore.toFixed(1) + '</span></td>';
        } else {
          html += '<td class="catalog-list-td catalog-list-td--bench"><span class="text-muted">—</span></td>';
        }
      }
    }

    html += '<td class="catalog-list-td"><span class="catalog-tag catalog-tag--license">' + escapeHtml(m.license) + '</span></td>';
    if (catalogUsesPresetBenchmarks()) {
      html += '<td class="catalog-list-td">' + catalogDeployButtonHtml(m.id, true) + '</td>';
    }
    html += '</tr>';

    // Detail panel row (hidden unless expanded)
    if (isExpanded) {
      var detailColspan = catalogUsesPresetBenchmarks() ? 12 : 10;
      html += '<tr class="catalog-detail-panel-row"><td colspan="' + detailColspan + '">';
      html += renderDetailPanel(m);
      html += '</td></tr>';
    }
  }

  html += '</tbody></table></div>';
  return html;
}

function renderDetailPanel(m) {
  var html = '<div class="catalog-detail-panel">';

  // Left: Info
  html += '<div class="catalog-detail-panel__info">';
  html += '<div class="catalog-detail-panel__section">';
  html += '<h4 class="catalog-detail-panel__title">' + escapeHtml(m.name) + '</h4>';
  html += '<div class="catalog-detail-kv">';
  html += '<div class="catalog-detail-kv__row"><span class="catalog-detail-kv__key">Source</span><span class="catalog-detail-kv__val">' + escapeHtml(m.source) + '</span></div>';
  html += '<div class="catalog-detail-kv__row"><span class="catalog-detail-kv__key">License</span><span class="catalog-detail-kv__val">' + escapeHtml(m.license) + '</span></div>';
  html += '<div class="catalog-detail-kv__row"><span class="catalog-detail-kv__key">Publisher</span><span class="catalog-detail-kv__val">' + escapeHtml(m.provider) + ' (' + publisherRegionLabel(m.publisher_region || 'other') + ')</span></div>';
  html += '<div class="catalog-detail-kv__row"><span class="catalog-detail-kv__key">Context</span><span class="catalog-detail-kv__val">' + formatContext(m.context) + ' tokens</span></div>';
  html += '<div class="catalog-detail-kv__row"><span class="catalog-detail-kv__key">Parameters</span><span class="catalog-detail-kv__val">' + escapeHtml(m.size) + '</span></div>';
  if (m.embedding_dim) {
    html += '<div class="catalog-detail-kv__row"><span class="catalog-detail-kv__key">Embedding dim</span><span class="catalog-detail-kv__val">' + m.embedding_dim + '</span></div>';
  }
  html += '</div>';

  // Capabilities
  if (m.capabilities.length > 0) {
    html += '<div class="catalog-detail-caps">';
    for (var ci = 0; ci < m.capabilities.length; ci++) {
      html += '<span class="catalog-cap-badge catalog-cap-badge--labeled">';
      html += '<i class="bi ' + capabilityIcon(m.capabilities[ci]) + '"></i> ' + capabilityLabel(m.capabilities[ci]);
      html += '</span>';
    }
    html += '</div>';
  }
  html += '</div>';
  html += '</div>';

  // Right: Benchmarks visualization
  html += '<div class="catalog-detail-panel__benchmarks">';
  html += '<div class="catalog-detail-panel__section">';
  html += '<h5 class="catalog-detail-bench-title">Benchmarks</h5>';
  var preset = getModelPreset(m);
  if (preset) {
    html += '<div class="catalog-detail-panel__preset-bench">' + renderPresetScoreList(preset) + '</div>';
  } else {
    var benchmarks;
    if ((m.modality || 'text') === 'embeddings') {
      benchmarks = [
        { key: 'mteb', label: 'MTEB', desc: 'Massive text embedding benchmark' },
        { key: 'retrieval', label: 'Retrieval', desc: 'Document retrieval' },
        { key: 'classification', label: 'Classification', desc: 'Text classification' }
      ];
    } else {
      benchmarks = [
        { key: 'mmlu', label: 'MMLU', desc: 'General knowledge' },
        { key: 'humaneval', label: 'HumanEval', desc: 'Code generation' },
        { key: 'math', label: 'MATH', desc: 'Mathematical reasoning' },
        { key: 'mt_bench', label: 'MT-Bench', desc: 'Multi-turn conversation', max: 10 }
      ];
    }
    for (var b = 0; b < benchmarks.length; b++) {
      var bm = benchmarks[b];
      var score = m.benchmarks[bm.key];
      if (typeof score !== 'number') continue;
      var max = bm.max || 100;
      var pct = Math.min((score / max) * 100, 100);
      html += '<div class="catalog-detail-bench-item">';
      html += '<div class="catalog-detail-bench-item__header">';
      html += '<span class="catalog-detail-bench-item__label">' + bm.label + '</span>';
      html += '<span class="catalog-detail-bench-item__desc">' + bm.desc + '</span>';
      html += '<span class="catalog-detail-bench-item__score ' + benchmarkColorClass(bm.max === 10 ? score * 10 : score) + '">' + score.toFixed(1) + (bm.max === 10 ? '/10' : '') + '</span>';
      html += '</div>';
      html += '<div class="catalog-bench-row__bar catalog-bench-row__bar--detail"><span class="catalog-bench-row__fill" style="width:' + pct + '%;background:' + benchmarkColor(bm.max === 10 ? score * 10 : score) + '"></span></div>';
      html += '</div>';
    }
  }
  html += '</div>';
  html += '</div>';

  html += '</div>';
  return html;
}

/* ============================================
   Main render
   ============================================ */
function renderCatalog() {
  var filtered = filterModels(CATALOG_DATA);
  var sorted = sortModels(filtered);

  var $content = $('#catalog-content');
  switch (catalogState.view) {
    case 'card':
      $content.html(renderCardView(sorted));
      break;
    case 'list':
      $content.html(renderListView(sorted));
      break;
    case 'detail':
      $content.html(renderDetailView(sorted));
      break;
  }
}

/* ============================================
   Filter state helpers
   ============================================ */
function readFilterState() {
  catalogState.filters.interfaces = [];
  $('[data-filter="interfaces"]:checked').each(function () {
    catalogState.filters.interfaces.push($(this).val());
  });

  catalogState.filters.capability = [];
  $('[data-filter="capability"]:checked').each(function () {
    catalogState.filters.capability.push($(this).val());
  });

  catalogState.filters.license = [];
  $('[data-filter="license"]:checked').each(function () {
    catalogState.filters.license.push($(this).val());
  });

  catalogState.filters.publisher_region = [];
  $('[data-filter="publisher_region"]:checked').each(function () {
    catalogState.filters.publisher_region.push($(this).val());
  });

  var ctxEl = $('#filter-context');
  catalogState.filters.context = ctxEl.length ? parseInt(ctxEl.val(), 10) : 0;
  var sizeEl = $('#filter-size');
  catalogState.filters.size = sizeEl.length ? parseInt(sizeEl.val(), 10) : 0;
}

function updateActiveFilters() {
  var $container = $('#catalog-active-filters');
  var chips = [];
  var f = catalogState.filters;

  // Don't show "text" as active chip since it's default checked
  for (var i = 0; i < f.interfaces.length; i++) {
    if (f.interfaces[i] !== 'text') {
      chips.push({ type: 'interfaces', value: f.interfaces[i], label: 'Interface: ' + f.interfaces[i] });
    }
  }
  for (var c = 0; c < f.capability.length; c++) {
    chips.push({ type: 'capability', value: f.capability[c], label: capabilityLabel(f.capability[c]) });
  }
  for (var l = 0; l < f.license.length; l++) {
    chips.push({ type: 'license', value: f.license[l], label: f.license[l] });
  }
  for (var pr = 0; pr < f.publisher_region.length; pr++) {
    chips.push({ type: 'publisher_region', value: f.publisher_region[pr], label: 'Publisher: ' + publisherRegionLabel(f.publisher_region[pr]) });
  }
  if (f.context > 0) {
    chips.push({ type: 'context', value: f.context, label: 'Context \u2265 ' + CONTEXT_LABELS[f.context] });
  }
  if (f.size > 0) {
    chips.push({ type: 'size', value: f.size, label: 'Size: ' + SIZE_LABELS[f.size] });
  }

  if (chips.length === 0) {
    $container.html('');
    return;
  }

  var html = '';
  for (var ci = 0; ci < chips.length; ci++) {
    html += '<span class="catalog-active-chip" data-chip-type="' + chips[ci].type + '" data-chip-value="' + chips[ci].value + '">';
    html += escapeHtml(chips[ci].label);
    html += ' <i class="bi bi-x"></i></span>';
  }
  $container.html(html);
}

function updateRangeDisplay() {
  var $ctx = $('#filter-context');
  if ($ctx.length) $('#filter-context-val').text(CONTEXT_LABELS[parseInt($ctx.val(), 10)]);
  var $size = $('#filter-size');
  if ($size.length) $('#filter-size-val').text(SIZE_LABELS[parseInt($size.val(), 10)]);
}

/* ============================================
   Init
   ============================================ */
function initCatalog() {
  // Top-level modality tabs (Text / Embeddings)
  $(document).on('click', '.catalog-modality-tab', function (e) {
    e.preventDefault();
    var $tab = $(this);
    catalogState.modality = $tab.data('modality');
    $('.catalog-modality-tab').removeClass('active').attr('aria-selected', 'false');
    $tab.addClass('active').attr('aria-selected', 'true');
    catalogState.expandedId = null;
    renderCatalog();
  });

  // View toggle
  $(document).on('click', '.catalog-view-btn', function () {
    var $btn = $(this);
    catalogState.view = $btn.data('view');
    $('.catalog-view-btn').removeClass('active');
    $btn.addClass('active');
    catalogState.expandedId = null;
    renderCatalog();
  });

  // Sort
  $('#catalog-sort-select').on('change', function () {
    catalogState.sort = $(this).val();
    renderCatalog();
  });

  // Search
  var searchTimer;
  $('#catalog-search').on('input', function () {
    var val = $(this).val();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      catalogState.search = val;
      renderCatalog();
    }, 200);
  });

  // Filter toggle
  $('#catalog-filter-toggle').on('click', function () {
    var $panel = $('#catalog-filter-panel');
    var $btn = $(this);
    var isOpen = $panel.is(':visible');
    if (isOpen) {
      $panel.slideUp(200);
      $btn.removeClass('active').attr('aria-expanded', 'false');
    } else {
      $panel.slideDown(200);
      $btn.addClass('active').attr('aria-expanded', 'true');
    }
  });

  // Filter changes
  $(document).on('change', '[data-filter]', function () {
    readFilterState();
    updateActiveFilters();
    renderCatalog();
  });

  // Range sliders
  $('#filter-context, #filter-size').on('input', function () {
    updateRangeDisplay();
    readFilterState();
    updateActiveFilters();
    renderCatalog();
  });

  // Reset filters
  $('#catalog-filter-reset').on('click', function () {
    $('[data-filter]').each(function () {
      var $el = $(this);
      if ($el.attr('data-filter') === 'interfaces' && $el.val() === 'text') {
        $el.prop('checked', true);
      } else {
        $el.prop('checked', false);
      }
    });
    $('#filter-context').val(0);
    $('#filter-size').val(0);
    updateRangeDisplay();
    readFilterState();
    updateActiveFilters();
    renderCatalog();
  });

  // Remove active filter chip
  $(document).on('click', '.catalog-active-chip', function () {
    var type = $(this).data('chip-type');
    var value = $(this).data('chip-value');

    if (type === 'context') {
      $('#filter-context').val(0);
    } else if (type === 'size') {
      $('#filter-size').val(0);
    } else {
      $('[data-filter="' + type + '"][value="' + value + '"]').prop('checked', false);
    }
    updateRangeDisplay();
    readFilterState();
    updateActiveFilters();
    renderCatalog();
  });

  // Card click → open modal
  $(document).on('click', '.catalog-card', function () {
    var id = $(this).data('model-id');
    var model = findModel(id);
    if (model) showCatalogModal(model);
  });

  // List row click → open modal
  $(document).on('click', '.catalog-list-row', function () {
    var id = $(this).data('model-id');
    var model = findModel(id);
    if (model) showCatalogModal(model);
  });

  // Detail row click → expand/collapse
  $(document).on('click', '.catalog-detail-row', function () {
    var id = $(this).data('model-id');
    if (catalogState.expandedId === id) {
      catalogState.expandedId = null;
    } else {
      catalogState.expandedId = id;
    }
    renderCatalog();
  });

  // Initial render
  readFilterState();
  renderCatalog();
}

function findModel(id) {
  for (var i = 0; i < CATALOG_DATA.length; i++) {
    if (CATALOG_DATA[i].id === id) return CATALOG_DATA[i];
  }
  return null;
}

function showCatalogModal(m) {
  var html = '<div class="catalog-modal-content">';

  // Header area
  html += '<div class="catalog-modal-header">';
  html += '<div class="catalog-modal-name">' + escapeHtml(m.name) + '</div>';
  html += '<div class="catalog-modal-provider">' + escapeHtml(m.provider) + ' &middot; ' + escapeHtml(m.source) + '</div>';
  html += '</div>';

  // Use-case tags (prominent)
  if (m.use_cases && m.use_cases.length > 0) {
    html += '<div class="catalog-modal-usecases">';
    for (var u = 0; u < m.use_cases.length; u++) {
      var uc = m.use_cases[u];
      html += '<span class="catalog-tag catalog-tag--usecase catalog-tag--usecase-' + uc + '">';
      html += '<i class="bi ' + useCaseIcon(uc) + '"></i> ' + useCaseLabel(uc);
      html += '</span>';
    }
    html += '</div>';
  }

  // Tags
  html += '<div class="catalog-modal-tags">';
  html += '<span class="catalog-tag catalog-tag--neutral catalog-tag--size">' + escapeHtml(m.size) + '</span>';
  html += '<span class="catalog-tag catalog-tag--neutral catalog-tag--context">' + formatContext(m.context) + ' ctx</span>';
  html += '<span class="catalog-tag catalog-tag--license">' + escapeHtml(m.license) + '</span>';
  html += '</div>';

  // Capabilities
  if (m.capabilities.length > 0) {
    html += '<div class="catalog-modal-caps">';
    for (var ci = 0; ci < m.capabilities.length; ci++) {
      html += '<span class="catalog-cap-badge catalog-cap-badge--labeled">';
      html += '<i class="bi ' + capabilityIcon(m.capabilities[ci]) + '"></i> ' + capabilityLabel(m.capabilities[ci]);
      html += '</span>';
    }
    html += '</div>';
  }

  // Benchmarks
  html += '<div class="catalog-modal-benchmarks">';
  var benchmarks;
  if ((m.modality || 'text') === 'embeddings') {
    benchmarks = [
      { key: 'mteb', label: 'MTEB', desc: 'Massive text embedding benchmark' },
      { key: 'retrieval', label: 'Retrieval', desc: 'Document retrieval' },
      { key: 'classification', label: 'Classification', desc: 'Text classification' }
    ];
  } else {
    benchmarks = [
      { key: 'mmlu', label: 'MMLU', desc: 'General knowledge' },
      { key: 'humaneval', label: 'HumanEval', desc: 'Code generation' },
      { key: 'math', label: 'MATH', desc: 'Mathematical reasoning' },
      { key: 'mt_bench', label: 'MT-Bench', desc: 'Multi-turn conversation', max: 10 }
    ];
  }
  for (var b = 0; b < benchmarks.length; b++) {
    var bm = benchmarks[b];
    var score = m.benchmarks[bm.key];
    if (typeof score !== 'number') continue;
    var max = bm.max || 100;
    var pct = Math.min((score / max) * 100, 100);
    html += '<div class="catalog-detail-bench-item">';
    html += '<div class="catalog-detail-bench-item__header">';
    html += '<span class="catalog-detail-bench-item__label">' + bm.label + '</span>';
    html += '<span class="catalog-detail-bench-item__desc">' + bm.desc + '</span>';
    html += '<span class="catalog-detail-bench-item__score ' + benchmarkColorClass(bm.max === 10 ? score * 10 : score) + '">' + score.toFixed(1) + (bm.max === 10 ? '/10' : '') + '</span>';
    html += '</div>';
    html += '<div class="catalog-bench-row__bar catalog-bench-row__bar--detail"><span class="catalog-bench-row__fill" style="width:' + pct + '%;background:' + benchmarkColor(bm.max === 10 ? score * 10 : score) + '"></span></div>';
    html += '</div>';
  }
  html += '</div>';

  html += '</div>';

  $('#model-detail-modal-label').text(m.name);
  $('#model-detail-body').html(html);
  var modal = new bootstrap.Modal(document.getElementById('model-detail-modal'));
  modal.show();
}

/* ============================================
   DOM Ready
   ============================================ */
/* Expose preset benchmark renderers for deploy_model_select.html overrides */
if (typeof window !== 'undefined') {
  window.renderPresetScoreList = renderPresetScoreList;
  window.getModelPreset = getModelPreset;
  window.benchmarksFromPreset = benchmarksFromPreset;
  window.catalogUsesPresetBenchmarks = catalogUsesPresetBenchmarks;
  window.catalogDeployButtonHtml = catalogDeployButtonHtml;
}

$(function () {
  if ($('#catalog-content').length) {
    initCatalog();
  }
});
