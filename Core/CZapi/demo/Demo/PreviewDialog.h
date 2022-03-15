#pragma once
#include "afxwin.h"

// CPreviewDialogEx 对话框

class CPreviewDialog : public CDialog
{
	DECLARE_DYNAMIC(CPreviewDialog)

public:
	CPreviewDialog(CWnd* pParent = NULL);   // 标准构造函数
	virtual ~CPreviewDialog();

	void NotifyDialogInited(const char* exeFolder = nullptr);

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_DIALOG_PREVIEW };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

	DECLARE_MESSAGE_MAP()
	afx_msg void OnOK() {};  // 防止回车后窗口不见了
	afx_msg void OnCancel() {};  // 防止按esc后窗口不见了
	afx_msg void OnBnClickedButtonPreviewPlay();
	afx_msg void OnBnClickedButtonPreviewStop();
	afx_msg void OnBnClickedButtonPreviewSnap();
	afx_msg void OnBnClickedButtonPreviewOpensound();
	afx_msg void OnBnClickedButtonPreviewClosesound();
	afx_msg void OnBnClickedButtonPreviewVideoDetail();
	afx_msg void OnBnClickedButtonPreviewGetvolume();
	afx_msg void OnBnClickedButtonPreviewSetvolume();
	afx_msg void OnBnClickedButtonPreviewSetosd();
	afx_msg void OnBnClickedButtonPreviewStartLocalrecord();
	afx_msg void OnBnClickedButtonPreviewStopLocalrecord();
	afx_msg void OnBnClickedButtonPreviewChangleStreamtype();
	afx_msg void OnLbnDblclkListPlaybackMsgbox();
	afx_msg void OnBnClickedButtonPreviewPrivateOpen();
	afx_msg void OnBnClickedButtonPreviewPrivateClose();
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	afx_msg LRESULT OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam);

protected:
	static void __stdcall cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void* pUserData);
	static void __stdcall cb_streamCallback(VIDEO_INT64 i64PlayHandle, int iStreamDataType, const char* pDataArray, int iDataLen, void* pUserData);
	static void __stdcall cb_decodedDataCallback(VIDEO_INT64 i64PlayHandle, const char* pDataArray, int iDataLen, int iWidth, int iHeight, int iFrameType, int iTimeStamp, void* pUserData);

private:
	void _initData();
	void _printMsg(const std::string& func, int ret, int errorCode, ULONGLONG costs);
	void _printMsg(const std::string& msg);
    void _showListHovScollBar();


private:
	CStatic _playWnd;
	CToolTipCtrl _toolTip;
	std::string _exefold;  // 不包含最后的“/”或“\\”的exe路径
	CListBox _msgList;
	CTime _timer;
	VIDEO_INT64 _playHandle = -1;
	time_t _cbTime = time(nullptr);
	CString _url;
	CString _snapPicAbsoluteFileName;
	int _volume;
	CString _osdText;
	CString _localRecordAbsoluteFileName;
	int _localRecordType;
	CComboBox _osdIdComboBox;
	int _osdStartX;
	int _osdStartY;
	int _osdFontSize;
	int _osdColorR;
	int _osdColorG;
	int _osdColorB;
	int _osdAlignType;
	int _osdBold;
	CString _streamInfo;
	CString _yuvInfo;
	time_t _time4Stream = -1;
	time_t _time4Yuv = -1;
	int _volumeToSet;
	LONGLONG _packageSize;
	int _privateMainType;
	int _privateSubType;
};
