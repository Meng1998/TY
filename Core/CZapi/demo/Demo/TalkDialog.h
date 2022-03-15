#pragma once


// CTalkDialog �Ի���

class CTalkDialog : public CDialog
{
	DECLARE_DYNAMIC(CTalkDialog)

public:
	CTalkDialog(CWnd* pParent = NULL);   // ��׼���캯��
	virtual ~CTalkDialog();

	void NotifyDialogInited(const char* exeFolder = nullptr);

// �Ի�������
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_DIALOG_TALK };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV ֧��
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	virtual void OnOK() {};
	virtual void OnCancel() {};
	afx_msg void OnBnClickedButtonStartTalk();
	afx_msg void OnBnClickedButtonStopTalk2();
	afx_msg void OnLbnDblclkListTalkMsgbox();
	afx_msg LRESULT OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam);

private:
	void _printMsg(const std::string & func, int ret, int errorCode, ULONGLONG costs);
	void _printMsg(const std::string& msg);
	static void __stdcall cb_TalkMsg(VIDEO_INT64 i64PlayHandle, int iMsg, void* pUserData);
    void _showListHovScollBar();

	DECLARE_MESSAGE_MAP()

private:
	CToolTipCtrl _toolTip;
	CListBox _msgList;
};
