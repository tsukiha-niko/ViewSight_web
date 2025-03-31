/**
 * 处理专业模式的分析逻辑
 */
export const handleAnalyzeProfessional = async ({
    title,
    coverFile,
    videoFile,
    historicalPlayCount,
    historicalLikeCount,
    fanCount,
    partition,
    scriptContent,
    setLogs,
    videoDuration, // 输入框传入的视频时长
    onAnalysisComplete,
    onLoadingChange,
    clearOutputs,
    setSnackbarMessage,
    setSnackbarOpen,
    t,
    getAppSettings,
    safeFetch,
}) => {
    // --- 输入验证 ---
    if (!title || !coverFile || !historicalPlayCount || !historicalLikeCount || !fanCount || !partition) {
        setSnackbarMessage(t('fillAllFields') || '请填充所有专业模式的输入项（除视频外）');
        setSnackbarOpen(true);
        return;
    }

    // --- 计算 p_rating ---
    const playCountNum = parseFloat(historicalPlayCount);
    const likeCountNum = parseFloat(historicalLikeCount);
    if (isNaN(playCountNum) || isNaN(likeCountNum) || playCountNum <= 0) {
        setSnackbarMessage(t('invalidHistoricalData') || '历史播放数或点赞数无效，请输入有效数字且播放数大于0');
        setSnackbarOpen(true);
        return;
    }
    const pRating = likeCountNum / playCountNum;

    // 清除旧输出并开始加载
    if (clearOutputs) clearOutputs();
    else console.error("clearOutputs function not passed!");
    if (onLoadingChange) onLoadingChange(true);

    // --- 初始化变量 ---
    let coverInfo = null,
        finalVideoDuration = null, // 最终传递给后端的时长
        videoSummary = null,
        trendingAnalysis = null,
        predictedPlayCount = null;

    try {
        // --- 获取后端配置 ---
        const appSettings = getAppSettings();
        const backendUrl = appSettings.backendUrl;
        console.log('Using Backend URL for Professional Analysis:', backendUrl);
        if (!backendUrl || !backendUrl.startsWith('http')) throw new Error('Invalid backend URL configured.');

        // --- API 调用流程 ---

        // 1. 上传标题
        const titleResponse = await safeFetch(`${backendUrl}/up_title`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, config: appSettings }),
        });
        if (!titleResponse.ok) throw new Error(`${t('titleUploadFailed') || '标题上传失败'} (${titleResponse.status})`);
        const titleData = await titleResponse.json();
        if (titleData.step && titleData.message) setLogs(prev => [...prev, `${titleData.step}: ${titleData.message}`]);
        else if (titleData.message) setLogs(prev => [...prev, titleData.message]);

        // 2. 上传封面
        const coverFormData = new FormData();
        coverFormData.append('file', coverFile);
        coverFormData.append('config', JSON.stringify(appSettings));
        const coverResponse = await safeFetch(`${backendUrl}/up_img`, { method: 'POST', body: coverFormData });
        if (!coverResponse.ok) throw new Error(`${t('coverUploadFailed') || '封面上传失败'} (${coverResponse.status})`);
        const coverData = await coverResponse.json();
        coverInfo = coverData.img_info;
        if (coverData.step && coverData.message) setLogs(prev => [...prev, `${coverData.step}: ${coverData.message}`]);
        else if (coverData.message) setLogs(prev => [...prev, coverData.message]);

        // 3. 上传视频（如果有视频文件）
        let frameAnalysis = null;
        if (videoFile) {
            const videoFormData = new FormData();
            videoFormData.append('file', videoFile);
            videoFormData.append('config', JSON.stringify(appSettings));
            if (scriptContent) videoFormData.append('scriptContent', scriptContent);

            const videoResponse = await safeFetch(`${backendUrl}/up_video`, { method: 'POST', body: videoFormData });
            if (!videoResponse.ok) throw new Error(`${t('videoUploadFailed') || '视频上传失败'} (${videoResponse.status})`);
            const videoData = await videoResponse.json();
            videoSummary = videoData.video_summary;
            finalVideoDuration = videoData.duration_seconds; // 优先使用后端解析的时长
            frameAnalysis = videoData.frame_analysis;
            if (videoData.step && videoData.message) setLogs(prev => [...prev, `${videoData.step}: ${videoData.message}`]);
            else if (videoData.message) setLogs(prev => [...prev, videoData.message]);
        } else {
            setLogs(prev => [...prev, "视频上传: ❎ 视频分析跳过"]);
            videoSummary = t('未提供视频，跳过视频分析');
            frameAnalysis = [];
            // 如果没有上传视频，检查输入框的 videoDuration
            const inputDuration = parseInt(videoDuration, 10);
            if (!isNaN(inputDuration) && inputDuration >= 0) {
                finalVideoDuration = inputDuration; // 使用输入框的值
            } else {
                finalVideoDuration = 60; // 默认值 60 秒
            }
        }

        // 4. 调用 /analyze_video_cover
        const combinedInfo = {
            "视频标题": title,
            "封面评论": coverInfo,
            "分区": partition,
            "粉丝数": fanCount,
            "up历史点赞数": historicalLikeCount,
            "up历史稿件播放数": historicalPlayCount,
            "p_rating": pRating,
            "时长(秒)": finalVideoDuration, // 使用最终确定的时长
            "视频文案": scriptContent || '',
        };
        const analyzeResponse = await safeFetch(`${backendUrl}/analyze_video_cover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                combined_info: combinedInfo,
                config: appSettings,
                frame_info: frameAnalysis,
                video_summary: videoSummary,
            }),
        });
        if (!analyzeResponse.ok) throw new Error(`${t('analysisFailed') || '综合分析失败'} (${analyzeResponse.status})`);
        const analyzeData = await analyzeResponse.json();
        if (analyzeData.step && analyzeData.message) setLogs(prev => [...prev, `${analyzeData.step}: ${analyzeData.message}`]);
        else if (analyzeData.message) setLogs(prev => [...prev, analyzeData.message]);
        trendingAnalysis = analyzeData.trending_analysis || {};

        // 5. 调用 /analyze_model_evaluation
        const evaluationResponse = await safeFetch(`${backendUrl}/analyze_model_evaluation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                settings: appSettings,
                "视频标题": title,
                "封面评论": coverInfo,
                "分区": partition,
                "粉丝数": fanCount,
                "p_rating": pRating,
                "时长（秒）": finalVideoDuration, // 使用最终确定的时长
                "trending": trendingAnalysis.trending || "0.00",
                "emotion": trendingAnalysis.emotion || "0.00",
                "visual": trendingAnalysis.visual || "0.00",
                "creativity": trendingAnalysis.creativity || "0.00",
            }),
        });
        if (!evaluationResponse.ok) {
            console.error(`Failed to call /analyze_model_evaluation: ${evaluationResponse.status}`);
            throw new Error(`Failed to call /analyze_model_evaluation: ${evaluationResponse.status}`);
        }
        const evaluationData = await evaluationResponse.json();
        if (evaluationData.step && evaluationData.message) setLogs(prev => [...prev, `${evaluationData.step}: ${evaluationData.message}`]);
        else if (evaluationData.message) setLogs(prev => [...prev, evaluationData.message]);
        predictedPlayCount = evaluationData.predicted_play_count;
        console.log("Result from /analyze_model_evaluation:", evaluationData);

        // --- 回传结果 ---
        if (onAnalysisComplete) {
            onAnalysisComplete({
                coverInfo: coverInfo,
                videoSummary: videoSummary,
                trending_analysis: trendingAnalysis,
                scriptContent: scriptContent,
                predicted: predictedPlayCount,  // 修改为 predicted
            });
        }

    } catch (err) {
        console.error("Analysis Error:", err);
        setSnackbarMessage(`${t('error')}: ${err.message || 'Unknown error during analysis'}`);
        setSnackbarOpen(true);
        setLogs(prev => [...prev, `${t('error')}: ${err.message}`]);
        if (onAnalysisComplete) {
            onAnalysisComplete({ error: err.message });
        }
    } finally {
        if (onLoadingChange) onLoadingChange(false);
    }
};