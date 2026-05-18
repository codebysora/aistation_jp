/**
 * AIStation Dashboard — Deploy preset data
 * sample_data/preset.json と同一内容を、先方サンプル jinja2 テンプレが想定する
 * フラット `preset_list` 形式に正規化して提供する。
 *
 * 本ファイルは deploy_model_select.html (案A 採用) で使用。
 * mocks/_preset_data.js とは現状同期コピー（採用案決定後の本実装側）。
 */
(function (root) {
  var PRESETS_RAW = {
    "qwen3-0.6b-cpu": {
      "inference_backend": "vllm",
      "engine_version": "v0.14.0",
      "model_source": "Qwen/Qwen3-0.6B",
      "parameters": { "args": ["enable-auto-tool-choice"], "kwargs": { "reasoning-parser": "qwen3", "tool-call-parser": "hermes", "max-model-len": "4096" } },
      "required_resources": { "cpu": { "count": 1, "memory_gb": 2 }, "gpu": null },
      "model_definition": {
        "capabilities": { "tool_use": true, "reasoning": true },
        "context": { "max_input_tokens": 4096, "max_output_tokens": 4096 },
        "interfaces": { "input_modalities": ["text"], "output_modalities": ["text"] },
        "meta": { "developer": "Alibaba Cloud", "release_data": "2025-04-27", "license": "Apache-2.0" },
        "perf": { "artificial_analysis": {
          "intelligence_index": 5.7, "coding_index": 1.4, "math_index": 10.3,
          "mmlu_pro": 0.231, "gpqa": 0.231, "hle": 0.052, "livecodebench": 0.073,
          "scicode": 0.041, "math_500": 0.521, "aime": 0.017, "aime_25": 0.103,
          "ifbench": 0.219, "lcr": 0, "terminalbench_hard": 0, "tau2": 0.146,
          "median_output_tokens_per_second": 194.314,
          "median_time_to_first_token_seconds": 0.923,
          "median_time_to_first_answer_token": 0.923
        } }
      }
    },
    "qwen3-0.6b-gpu-long": {
      "inference_backend": "vllm", "engine_version": "latest", "model_source": "Qwen/Qwen3-0.6B",
      "parameters": { "kwargs": { "max-model-len": "131072" } },
      "required_resources": { "cpu": null, "gpu": { "count": 1, "memory_gb": 24 } },
      "model_definition": {
        "capabilities": { "tool_use": true, "reasoning": true },
        "context": { "max_input_tokens": 131072 },
        "interfaces": { "input_modalities": ["text"], "output_modalities": ["text"] },
        "meta": { "developer": "Alibaba Cloud", "release_data": "2025-04-27", "license": "Apache-2.0" },
        "perf": { "artificial_analysis": {
          "intelligence_index": 5.7, "coding_index": 1.4, "math_index": 10.3,
          "mmlu_pro": 0.231, "gpqa": 0.231, "hle": 0.052, "livecodebench": 0.073,
          "scicode": 0.041, "math_500": 0.521, "aime": 0.017, "aime_25": 0.103,
          "ifbench": 0.219, "lcr": 0, "terminalbench_hard": 0, "tau2": 0.146,
          "median_output_tokens_per_second": 194.314,
          "median_time_to_first_token_seconds": 0.923,
          "median_time_to_first_answer_token": 0.923
        } }
      }
    },
    "qwen3.5-0.8b": {
      "inference_backend": "vllm", "engine_version": "latest", "model_source": "Qwen/Qwen3.5-0.8B",
      "parameters": { "kwargs": { "max-model-len": "262144" } },
      "required_resources": { "cpu": null, "gpu": { "count": 1, "memory_gb": 24 } },
      "model_definition": {
        "capabilities": { "tool_use": true, "reasoning": true },
        "context": { "max_input_tokens": 262144 },
        "interfaces": { "input_modalities": ["text", "image"], "output_modalities": ["text"] },
        "meta": { "developer": "Alibaba Cloud", "release_data": "2026-04-01", "license": "Apache-2.0" },
        "perf": { "artificial_analysis": {
          "intelligence_index": 10.5, "coding_index": 0, "math_index": null,
          "mmlu_pro": null, "gpqa": 0.111, "hle": 0.012, "livecodebench": null,
          "scicode": 0, "math_500": null, "aime": null, "aime_25": null,
          "ifbench": 0.215, "lcr": 0.053, "terminalbench_hard": 0, "tau2": 0.477,
          "median_output_tokens_per_second": 0,
          "median_time_to_first_token_seconds": 0,
          "median_time_to_first_answer_token": 0
        } }
      }
    },
    "gemma4-e2b-it": {
      "inference_backend": "vllm", "engine_version": "gemma4", "model_source": "google/gemma-4-E2B-it",
      "parameters": { "kwargs": { "max-model-len": "131072" } },
      "required_resources": { "cpu": null, "gpu": { "count": 1, "memory_gb": 24 } },
      "model_definition": {
        "capabilities": { "tool_use": true, "reasoning": true },
        "context": { "max_input_tokens": 131072 },
        "interfaces": { "input_modalities": ["text", "image", "audio", "video"], "output_modalities": ["text"] },
        "meta": { "developer": "Google", "release_data": "2026-04-02", "license": "Apache-2.0" },
        "perf": { "artificial_analysis": {
          "intelligence_index": 15.2, "coding_index": 9, "math_index": null,
          "mmlu_pro": null, "gpqa": 0.433, "hle": 0.048, "livecodebench": null,
          "scicode": 0.209, "math_500": null, "aime": null, "aime_25": null,
          "ifbench": 0.38, "lcr": 0.15, "terminalbench_hard": 0.03, "tau2": 0.208,
          "median_output_tokens_per_second": 0,
          "median_time_to_first_token_seconds": 0,
          "median_time_to_first_answer_token": 0
        } }
      }
    },
    "gemma3n-e2b-it": {
      "inference_backend": "vllm", "engine_version": "gemma4", "model_source": "google/gemma-3n-E2B-it",
      "parameters": { "kwargs": { "max-model-len": "32768" } },
      "required_resources": { "cpu": null, "gpu": { "count": 1, "memory_gb": 24 } },
      "model_definition": {
        "capabilities": { "tool_use": false, "reasoning": false },
        "context": { "max_input_tokens": 32768 },
        "interfaces": { "input_modalities": ["text", "image", "audio"], "output_modalities": ["text"] },
        "meta": { "developer": "Google", "release_data": "2025-06-26", "license": "gemma" },
        "perf": { "artificial_analysis": {
          "intelligence_index": 4.8, "coding_index": 2.2, "math_index": 10.3,
          "mmlu_pro": 0.378, "gpqa": 0.229, "hle": 0.04, "livecodebench": 0.095,
          "scicode": 0.052, "math_500": 0.691, "aime": 0.09, "aime_25": 0.103,
          "ifbench": 0.22, "lcr": 0, "terminalbench_hard": 0.008, "tau2": 0,
          "median_output_tokens_per_second": 49.574,
          "median_time_to_first_token_seconds": 0.456,
          "median_time_to_first_answer_token": 0.456
        } }
      }
    }
  };

  function normalizePreset(id, raw) {
    var def = raw.model_definition || {};
    var perf = (def.perf && def.perf.artificial_analysis) || {};
    var ifs = def.interfaces || {};
    var meta = def.meta || {};
    var ctx = def.context || {};
    var caps = def.capabilities || {};
    var res = raw.required_resources || {};
    var resourceType = res.gpu ? 'GPU' : (res.cpu ? 'CPU' : '—');

    return {
      id: id,
      developer: meta.developer || '—',
      license: meta.license || '—',
      release_data: meta.release_data || null,
      model_source: raw.model_source,
      engine_version: raw.engine_version,
      parameters: raw.parameters || {},
      required_resources: res,
      resource_type: resourceType,
      capabilities: caps,
      input_modalities: ifs.input_modalities || [],
      output_modalities: ifs.output_modalities || ['text'],
      max_input_tokens: ctx.max_input_tokens != null ? ctx.max_input_tokens : null,
      intelligence_index: perf.intelligence_index != null ? perf.intelligence_index : null,
      coding_index: perf.coding_index != null ? perf.coding_index : null,
      math_index: perf.math_index != null ? perf.math_index : null,
      median_output_tokens_per_second: perf.median_output_tokens_per_second != null ? perf.median_output_tokens_per_second : null,
      ttft: perf.median_time_to_first_token_seconds != null ? perf.median_time_to_first_token_seconds : null,
      tta: perf.median_time_to_first_answer_token != null ? perf.median_time_to_first_answer_token : null,
      mmlu_pro: perf.mmlu_pro != null ? perf.mmlu_pro : null,
      gpqa: perf.gpqa != null ? perf.gpqa : null,
      hle: perf.hle != null ? perf.hle : null,
      livecodebench: perf.livecodebench != null ? perf.livecodebench : null,
      scicode: perf.scicode != null ? perf.scicode : null,
      math_500: perf.math_500 != null ? perf.math_500 : null,
      aime: perf.aime != null ? perf.aime : null,
      aime_25: perf.aime_25 != null ? perf.aime_25 : null,
      ifbench: perf.ifbench != null ? perf.ifbench : null,
      lcr: perf.lcr != null ? perf.lcr : null,
      terminalbench_hard: perf.terminalbench_hard != null ? perf.terminalbench_hard : null,
      tau2: perf.tau2 != null ? perf.tau2 : null
    };
  }

  function getPresetList() {
    var list = [];
    for (var key in PRESETS_RAW) {
      if (Object.prototype.hasOwnProperty.call(PRESETS_RAW, key)) {
        list.push(normalizePreset(key, PRESETS_RAW[key]));
      }
    }
    return list;
  }

  function getDevelopers(list) {
    var seen = {}, out = [];
    for (var i = 0; i < list.length; i++) {
      var d = list[i].developer;
      if (d && !seen[d]) { seen[d] = 1; out.push(d); }
    }
    return out;
  }

  function getLicenses(list) {
    var seen = {}, out = [];
    for (var i = 0; i < list.length; i++) {
      var d = list[i].license;
      if (d && !seen[d]) { seen[d] = 1; out.push(d); }
    }
    return out;
  }

  root.PresetData = {
    raw: PRESETS_RAW,
    list: getPresetList(),
    getDevelopers: getDevelopers,
    getLicenses: getLicenses,
    normalizePreset: normalizePreset
  };
})(window);
