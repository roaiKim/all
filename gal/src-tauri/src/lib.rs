use serde::{Deserialize, Serialize};
use tauri::Manager;

// ---- Data types matching shared frontend types ----

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GameProject {
    pub meta: ProjectMeta,
    pub scenes: Vec<Scene>,
    pub variables: Vec<GameVariable>,
    pub assets: AssetManifest,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProjectMeta {
    pub title: String,
    pub version: String,
    pub author: String,
    pub resolution: Resolution,
    pub first_scene_id: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Resolution {
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Scene {
    pub id: String,
    pub name: String,
    #[serde(rename = "type")]
    pub scene_type: String,
    pub video_src: Option<String>,
    pub subtitles: Option<Vec<Subtitle>>,
    pub dialogue: Option<Vec<DialogueLine>>,
    pub choices: Option<Vec<Choice>>,
    pub next_scene_id: Option<String>,
    pub conditions: Option<Vec<Condition>>,
    pub effects: Option<Vec<Effect>>,
    pub bgm: Option<String>,
    pub background: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Subtitle {
    #[serde(rename = "startTime")]
    pub start_time: f64,
    #[serde(rename = "endTime")]
    pub end_time: f64,
    pub text: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DialogueLine {
    pub speaker: String,
    pub text: String,
    pub avatar: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Choice {
    pub id: String,
    pub text: String,
    pub next_scene_id: String,
    pub conditions: Option<Vec<Condition>>,
    pub effects: Option<Vec<Effect>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Condition {
    pub variable_id: String,
    pub operator: String,
    pub value: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Effect {
    pub variable_id: String,
    pub action: String,
    pub value: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GameVariable {
    pub id: String,
    pub name: String,
    pub key: String,
    #[serde(rename = "type")]
    pub var_type: String,
    pub default_value: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AssetManifest {
    pub videos: Vec<AssetItem>,
    pub images: Vec<AssetItem>,
    pub audios: Vec<AssetItem>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AssetItem {
    pub id: String,
    pub name: String,
    pub path: String,
    pub size: u64,
    pub mime_type: Option<String>,
}

// ---- IPC Payloads ----

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenPreviewPayload {
    pub game_data: GameProject,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveProjectPayload {
    pub file_path: Option<String>,
    pub game_data: GameProject,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportGamePayload {
    pub game_data: GameProject,
    pub output_dir: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveGamePayload {
    pub slot_index: usize,
    pub label: String,
    pub current_scene_id: String,
    pub variables: std::collections::HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoadGamePayload {
    pub slot_index: usize,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveResult {
    pub success: bool,
    pub file_path: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportResult {
    pub success: bool,
    pub output_path: Option<String>,
    pub error: Option<String>,
}

// ---- Tauri Commands ----

/// Open a preview player window with the current project data
#[tauri::command]
async fn open_preview(
    window: tauri::Window,
    game_data: GameProject,
) -> Result<(), String> {
    let app_handle = window.app_handle();

    // Serialize game data to pass through window label
    let json = serde_json::to_string(&game_data).map_err(|e| e.to_string())?;

    // Create preview window loading the player page
    let preview_window = tauri::WebviewWindowBuilder::new(
        app_handle,
        "preview",
        tauri::WebviewUrl::App("player/index.html".into()),
    )
    .title("GAL 预览")
    .inner_size(1920.0, 1080.0)
    .resizable(true)
    .center()
    .build()
    .map_err(|e| e.to_string())?;

    // Send game data once the window is ready
    let payload = serde_json::json!({ "data": game_data });
    preview_window
        .emit("load-game-data", payload)
        .map_err(|e| e.to_string())?;

    // Also store in app state for re-sending on reload
    app_handle.manage(GameDataState(json));

    Ok(())
}

/// Save the project to a file
#[tauri::command]
async fn save_project(
    payload: SaveProjectPayload,
) -> Result<SaveResult, String> {
    let path = payload.file_path.unwrap_or_else(|| {
        format!("{}.gal.json", payload.game_data.meta.title)
    });

    let json = serde_json::to_string_pretty(&payload.game_data)
        .map_err(|e| SaveResult {
            success: false,
            file_path: None,
            error: Some(e.to_string()),
        })
        .map_err(|e| e.error.unwrap_or_default())?;

    std::fs::write(&path, &json).map_err(|e| SaveResult {
        success: false,
        file_path: None,
        error: Some(e.to_string()),
    }).map_err(|e| e.error.unwrap_or_default())?;

    Ok(SaveResult {
        success: true,
        file_path: Some(path),
        error: None,
    })
}

/// Export the game as a standalone package
#[tauri::command]
async fn export_game(
    payload: ExportGamePayload,
) -> Result<ExportResult, String> {
    let output_dir = payload.output_dir.unwrap_or_else(|| "./gal-export".to_string());

    // Create export directory
    std::fs::create_dir_all(&output_dir).map_err(|e| ExportResult {
        success: false,
        output_path: None,
        error: Some(e.to_string()),
    }).map_err(|e| e.error.unwrap_or_default())?;

    // Write game data as JSON
    let json_path = std::path::Path::new(&output_dir).join("game.gal.json");
    let json = serde_json::to_string_pretty(&payload.game_data).map_err(|e| {
        ExportResult { success: false, output_path: None, error: Some(e.to_string()) }
    }).map_err(|e| e.error.unwrap_or_default())?;

    std::fs::write(&json_path, &json).map_err(|e| ExportResult {
        success: false,
        output_path: None,
        error: Some(e.to_string()),
    }).map_err(|e| e.error.unwrap_or_default())?;

    Ok(ExportResult {
        success: true,
        output_path: Some(output_dir),
        error: None,
    })
}

/// Save game progress (uses app data dir)
#[tauri::command]
async fn save_game(
    app: tauri::AppHandle,
    payload: SaveGamePayload,
) -> Result<SaveResult, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;

    let save_path = app_dir.join(format!("save_{}.json", payload.slot_index));
    let save_data = serde_json::json!({
        "id": format!("save_{}", payload.slot_index),
        "slotIndex": payload.slot_index,
        "timestamp": chrono_now(),
        "currentSceneId": payload.current_scene_id,
        "variables": payload.variables,
        "label": payload.label,
    });

    let json = serde_json::to_string_pretty(&save_data).map_err(|e| e.to_string())?;
    std::fs::write(&save_path, &json).map_err(|e| e.to_string())?;

    Ok(SaveResult {
        success: true,
        file_path: Some(save_path.to_string_lossy().to_string()),
        error: None,
    })
}

/// Load game progress
#[tauri::command]
async fn load_game(
    app: tauri::AppHandle,
    payload: LoadGamePayload,
) -> Result<Option<serde_json::Value>, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let save_path = app_dir.join(format!("save_{}.json", payload.slot_index));

    if !save_path.exists() {
        return Ok(None);
    }

    let json = std::fs::read_to_string(&save_path).map_err(|e| e.to_string())?;
    let data: serde_json::Value = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    Ok(Some(data))
}

// ---- App state (stored game data for preview windows) ----

struct GameDataState(String);

// ---- Helper ----

fn chrono_now() -> String {
    // Avoid pulling in chrono crate; use a simple approximation
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| {
            let secs = d.as_secs();
            // ISO 8601 basic format
            format!("{:?}", std::time::UNIX_EPOCH + std::time::Duration::from_secs(secs))
        })
        .unwrap_or_else(|_| "unknown".to_string())
}

// ---- App entry ----

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // In debug (dev) mode, auto-open the player window alongside the editor.
            // Both windows load from the same Vite dev server → independent HMR.
            // The player shows "等待编辑器推送数据..." until the editor pushes via IPC.
            #[cfg(debug_assertions)]
            {
                let _player = tauri::WebviewWindowBuilder::new(
                    app.handle(),
                    "player-dev",
                    tauri::WebviewUrl::App("player/index.html".into()),
                )
                .title("GAL 播放器")
                .inner_size(960.0, 600.0)
                .resizable(true)
                .center()
                .build();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_preview,
            save_project,
            export_game,
            save_game,
            load_game,
        ])
        .run(tauri::generate_context!())
        .expect("error while running GAL application");
}
