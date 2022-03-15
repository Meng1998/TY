#pragma once
#include "afxwin.h"
#include "afxdtctl.h"


// CRecordPlay 对话框

class CRecordPlayDialog : public CDialog
{
	DECLARE_DYNAMIC(CRecordPlayDialog)

public:
	CRecordPlayDialog(CWnd* pParent = NULL);   // 标准构造函数
	virtual ~CRecordPlayDialog();

	// 本接口中实现本模块各个控件的tooltip
	void NotifyDialogInited(const char* exeFolder = nullptr);

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_DIALOG_PLAYBACK };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

	DECLARE_MESSAGE_MAP()
	afx_msg void OnOK() {};  // 防止回车后窗口不见了
	afx_msg void OnCancel() {};  // 防止按esc后窗口不见了
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	afx_msg void OnBnClickedButtonRecordStart();
	afx_msg void OnBnClickedButtonRecordStop();
	afx_msg void OnBnClickedButtonRecordSnap();
	afx_msg void OnBnClickedButtonRecordOpensound();
	afx_msg void OnBnClickedButtonRecordClosesound();
	afx_msg void OnBnClickedButtonRecordVideoDetail();
	afx_msg void OnBnClickedButtonRecordGetvolume();
	afx_msg void OnBnClickedButtonRecordSetvolume();
	afx_msg void OnBnClickedButtonRecordSetosd();
	afx_msg void OnBnClickedButtonRecordStartLocalrecord();
	afx_msg void OnBnClickedButtonRecordStopLocalrecord();
	afx_msg void OnBnClickedButtonRecordPause();
	afx_msg void OnBnClickedButtonRecordResume();
	afx_msg void OnBnClickedButtonRecordGettimestamp();
	afx_msg void OnBnClickedButtonRecordSeek();
	afx_msg void OnBnClickedButtonRecordSpeed();
	afx_msg void OnLbnDblclkListPlaybackMsgbox();
	afx_msg void OnBnClickedButtonRecordPrivateOpen();
	afx_msg void OnBnClickedButtonRecordPrivateClose();
	afx_msg LRESULT OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam);

protected:
	void _initData();
	void _printMsg(const std::string& func, int ret, int errorCode, ULONGLONG costs);
	void _printMsg(const std::string& msg);
    void _showListHovScollBar();

protected:
	static void __stdcall cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void* pUserData);
	static void __stdcall cb_streamCallback(VIDEO_INT64 i64PlayHandle, int iStreamDataType, const char* pDataArray, int iDataLen, void* pUserData);
	static void __stdcall cb_decodedDataCallback(VIDEO_INT64 i64PlayHandle, const char* pDataArray, int iDataLen, int iWidth, int iHeight, int iFrameType, int iTimeStamp, void* pUserData);

private:
	long long _playHandle = -1;
	std::string _exefold;
	CString _url;
	CString _snapPicFile;
	int _volume;
	int _osdX;
	int _osdY;
	int _osdFontSize;
	int _osdR;
	int _osdG;
	int _osdB;
	int _osdAlignType;
	CComboBox _osdCombBox;
	CString _osdText;
	int _localRecordType;
	CString _localRecordFile;
	CListBox _msgBox;
	CStatic _recordPlayWnd;
	CString _streamInfo;
	CString _yuvInfo;
	time_t _time4Stream = -1;
	time_t _time4Yuv = -1;
	CToolTipCtrl _toolTip;
	CDateTimeCtrl _startDate;
	CDateTimeCtrl _startTime;
	CDateTimeCtrl _endDate;
	CDateTimeCtrl _endTime;
	int _isFontBold;
	LONGLONG _curPlayTimeStamp;
	LONGLONG _timeStampToSeek;
	int _volumeToSet;
	int _speed;
	LONGLONG _packageSize;
	int _privateMainType;
	int _privateSubType;
};
